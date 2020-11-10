<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use DB;

class DashboardController extends Controller
{
    public function index(){
        
        return view('home');
    }
    public function dashboardAPI(){
        // SELECT COUNT(*) FROM utmapp.clicks;
        $totalClicks = DB::table('clicks')->select(DB::raw('COUNT(*) as TotalClicks'))->get();
        return response()->json([ 
            "totalClicks" => $totalClicks[0]->TotalClicks,
            "WeeklyClicks" => [23,45,53,234,453,645,54]
        ]);
    }
    public function graphql(Request $request){
        
        $shop = Auth::user();
        // $request = $shop->api()->rest('GET', '/admin/shop.json');
        $request = $shop->api()->graph($request->input('query'));
          return json_encode($request['body']['data']) ;
    }
    
}
  