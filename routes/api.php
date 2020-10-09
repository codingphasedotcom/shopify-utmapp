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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth.shopify')->post('/createlink', 'LinkController@store');
Route::middleware('auth.shopify')->get('/links', 'LinkController@index');
Route::middleware('auth.shopify')->get('/links/{id}', 'LinkController@edit');
Route::middleware('auth.shopify')->put('/links/{id}', 'LinkController@update');
Route::middleware('auth.shopify')->delete('/links/{id}', 'LinkController@destroy');