<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class DashboardController extends Controller
{
    public function index(){
        return view('home');
    }
    public function graphql(Request $request){
        
        $shop = Auth::user();
        // $request = $shop->api()->rest('GET', '/admin/shop.json');
        $request = $shop->api()->graph($request->input('query'));
          return json_encode($request['body']['data']) ;
    }
    
}
