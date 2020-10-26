<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/app', function () {
    return view('home');
})->middleware(['auth.shopify'])->name('home');

Route::get('/{slug}', 'ShortlinkController@index');

Route::post('/app/graphql', [
    'uses' => 'DashboardController@graphql',
    'as' => 'qraphqlapi']);

Route::get('/app/{path}', [
    'uses' => 'DashboardController@index',
    'as' => 'dashboard',
    'where' => ['path' => '.*']
])->middleware(['auth.shopify']);

