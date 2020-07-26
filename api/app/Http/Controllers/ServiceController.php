<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;

class ServiceController extends Controller
{
    public function getRole(Request $request){

        return $request;

        return Role::select('roleid')->where('userid', $request->userid)->first();

    }
}
