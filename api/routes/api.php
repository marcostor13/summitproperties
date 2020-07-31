<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('register', 'JWTAuthController@register');
    Route::post('login', 'JWTAuthController@login');
    Route::post('logout', 'JWTAuthController@logout');
    Route::post('refresh', 'JWTAuthController@refresh');
    Route::get('profile', 'JWTAuthController@profile');
    
});

Route::group([
    'middleware' => ['jwt.verify'],    
], function ($router) {

    //ROLE
    Route::post('getRole', 'ServiceController@getRole');
    Route::post('addProperty', 'ServiceController@addProperty');
    Route::post('getProperties', 'ServiceController@getProperties');
    Route::post('getPropertyById', 'ServiceController@getPropertyById');    
    Route::post('editProperty', 'ServiceController@editProperty');
    Route::post('deleteProperty', 'ServiceController@deleteProperty');
    Route::post('getFiles', 'ServiceController@getFiles');
    Route::post('addFile', 'ServiceController@addFile');
    Route::post('deleteFile', 'ServiceController@deleteFile');
    Route::post('saveDescription', 'ServiceController@saveDescription');  
    
    Route::post('addItem', 'ServiceController@addItem');    
    Route::post('getList', 'ServiceController@getList');    
    Route::post('updateItem', 'ServiceController@updateItem');
    Route::post('deleteList', 'ServiceController@deleteList');
    Route::post('deleteItem', 'ServiceController@deleteItem');

    


    
});


