<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use App\File;
use App\Property;
use App\PropertiesUser;
use App\ListProperty;

class ServiceController extends Controller
{
    public function addProperty(Request $request){
        $property = new Property;
        $property->name = $request->name;
        $property->address = $request->address;
        $property->description = $request->description;
        $property->save();        
        return $property;   
    }

    public function getProperties(Request $request){
        $res = [];
        if($request->roleid == 1){
            $properties = Property::get();
            foreach ($properties as $p) {
                $p['files'] = File::where('propertyid', $p->id)->get();
                $res[] = $p;
            }
            return $res;
        }else{
            $properties = Property::get();
            // $properties = PropertiesUser::select('properties.*', 'properties_users.userid')
            // ->join('properties', 'properties.id', '=', 'properties_users.propertyid')
            // ->where('properties_users.userid', $request->userid)
            // ->get();
            foreach ($properties as $p) {
                $p['files'] = File::where('propertyid', $p->id)->get();
                $res[] = $p;
            }
            return $res;
        }
    }

    public function getPropertyById(Request $request){

        $properties = Property::where('id', $request->propertyid)->first();
        $properties['files'] = File::where('propertyid', $properties->id)->get();        
        return $properties;
        
    }

    public function editProperty(Request $request){        
        Property::where('id', $request->propertyid)->update([
            'name' => $request->name,
            'address' => $request->address,
            'description' => $request->description
        ]);        
        return ['status' => true, 'message' => 'Successful'];   
    }

    public function deleteProperty(Request $request){        
        Property::where('id', $request->propertyid)->delete();        
        return ['status' => true, 'message' => 'Successful']; 
    }

    public function getFiles(Request $request){
        return File::where('propertyid', $request->propertyid)->get();     
    }

    public function addFile(Request $request){

        $file = new File;
        $file->propertyid = $request->propertyid;
        $file->file = $request->file;
        $file->save();        
        return $file;   
    }

    public function deleteFile(Request $request){        
        File::where('id', $request->fileid)->delete();        
        return ['status' => true, 'message' => 'Successful']; 
    }

    public function deleteAllFiles(Request $request){
        File::where('propertyid', $request->propertyid)->delete();        
        return ['status' => true, 'message' => 'Successful']; 
    }

    public function saveDescription(Request $request){
        File::where('id', $request->fileid)->update(['description' => $request->description]);
        return ['status' => true, 'message' => 'Successful']; 
    }

    public function addItem(Request $request){
        $list = new ListProperty;
        $list->name = $request->name;
        $list->propertyid = $request->propertyid;
        if($request->observations){
            $list->observations = $request->observations;
        }       
        $list->save();        
        return $list;   
    }

    public function getList(Request $request){
        return ListProperty::where('propertyid', $request->propertyid)->get();        
    }

    public function updateItem(Request $request){
        ListProperty::where('id', $request->itemid)->update(['state' => $request->state]);  
        return ['status' => true, 'message' => 'Successful'];       
    }

    public function deleteList(Request $request){
        ListProperty::where('propertyid', $request->propertyid)->delete();  
        return ['status' => true, 'message' => 'Successful'];       
    }

    public function deleteItem(Request $request){
        ListProperty::where('id', $request->itemid)->delete();  
        return ['status' => true, 'message' => 'Successful'];       
    }


}
