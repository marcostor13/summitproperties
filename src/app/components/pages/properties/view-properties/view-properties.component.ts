import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Observable, Observer } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User } from '../../../../interfaces/user.interface';
import { map, finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.scss']
})
export class ViewPropertiesComponent implements OnInit {

  isLoad: Boolean = false
  auth$: Observable<User>
  roleid: any;
  items: Observable<any[]>
  type: String;
  id: String;
  loading = false;
  avatarUrl?: any;
  user: User;
  files: Array<any>[] = []
  images: any = []
  propertyIsSaved: Boolean = false;
  propertyInfo: any;

  //Inputs

  name: String;
  address: String;
  description: String;
  buttonDisabled: Boolean = true;
  response: String = ''
  
  effect = 'scrollx';


  //Upload

  title = "cloudsSorage";
  selectedFile: File = null;
  downloadURL: Observable<string>;
  previewImage: string | undefined = '';
  previewVisible = false;
  fileList: NzUploadFile[] = []

  responsiveOptions: any[];

  images2: any[] = [];


  //Firestore

  profileUrl: Observable<string | null>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private store: Store<{ auth: User }>,
    private storage: AngularFireStorage,
    private msg: NzMessageService,
    private general: GeneralService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.validateSession()
    // this.items = firestore.collection('items').valueChanges()
    if (this.id != '0') {
      this.api.c('ID', this.id)
      this.getPropertiById()
      this.propertyIsSaved = true
    }

  }

  ngOnInit(): void {
  }

  validateSession() {
    this.auth$ = this.store.pipe(select('auth'))
    this.auth$.subscribe((auth: any) => {
      if (!auth) {
        this.router.navigate(['/auth/login'])
      } else {
        this.user = auth;
      }
    })
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  handleChange(info: { file: NzUploadFile } | any): void {
    console.log('ingfo', info)
    switch (info.type) {
      case 'start':
        this.loading = true;
        break;
    }
  }


  handleUpload = (item: any) => {


    var n = Date.now();
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, item.file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.addFile(url)
            }
            console.log('fb', url);
            this.loading = false;
            this.avatarUrl = null;

          });
        })
      )
      .subscribe(url => {
        if (url) {
          // console.log('url subscribe', url);
        }
      });
  }


  getPropertiById() {

    this.isLoad = true
    let data = {
      service: 'getPropertyById',
      type: 'post',
      propertyid: this.id,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('getPropertiById', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        this.propertyInfo = result

        this.name = result.name,
          this.address = result.address,
          this.description = result.description,

          this.files = result.files
        this.files.forEach((e: any) => {

          this.images2.push({
            source: e.file,
            thumbnail: e.file,
            title: e.description,
          })

          this.images.push(
            {
              id: e.id,
              url: e.file
            }
          )
        });

      }

    },
      error => {
        this.isLoad = false
        this.api.c('Error', error)
        if (error.status == 401) {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        }
      });

  }

  addFile(file) {
    this.isLoad = true
    let data = {
      service: 'addFile',
      type: 'post',
      propertyid: this.id,
      file: file,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('addFile', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        this.images.push(
          {
            id: result.id,
            url: result.file
          }
        )
        this.images2.push({
          source: result.file,
          thumbnail: result.file,
          title: result.description,
        })
      }


    },
      error => {
        this.isLoad = false
        this.api.c('Error', error)
        if (error.status == 401) {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        }
      });
  }





  saveProperty() {

    if (this.name == '' || this.address == '' || this.description == '') {
      this.response = 'You must complete all the fields'
      return false
    } else {
      this.isLoad = true
      let data = {
        service: 'addProperty',
        type: 'post',
        name: this.name,
        address: this.address,
        description: this.description,
        token: this.user.token
      }
      this.api.api(data).subscribe((result: any) => {
        this.isLoad = false
        this.api.c('saveProperty', result)

        if (result.status == 'Token is Expired') {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        } else {
          this.id = result.id
          this.propertyIsSaved = true
        }


      },
        error => {
          this.isLoad = false
          this.api.c('Error', error)
          if (error.status == 401) {
            sessionStorage.setItem('ud', '')
            this.router.navigate(['/login']);
          }
        });



    }

  }


  saveDescription(e, fileid) {

    let description = e.target.parentElement.firstChild.value
    this.isLoad = true
    let data = {
      service: 'saveDescription',
      type: 'post',
      fileid: fileid,
      description: description,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('saveDescription', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      }
    },
      error => {
        this.isLoad = false
        this.api.c('Error', error)
        if (error.status == 401) {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        }
      });


  }

  deleteFile(fileid, url) {

    this.isLoad = true
    let data = {
      service: 'deleteFile',
      type: 'post',
      fileid: fileid,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('deleteFile', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        if (result.status) {
          this.images = this.general.deleteElementOfArray(fileid, this.images)
          this.api.deleteProductImage(url)
        }
      }

    },
      error => {
        this.isLoad = false
        this.api.c('Error', error)
        if (error.status == 401) {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        }
      });


  }







}

