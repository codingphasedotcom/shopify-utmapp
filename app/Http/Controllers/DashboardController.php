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
        
        $userID = Auth::id();
        $totalClicks = DB::table('clicks as c')
        ->select(DB::raw('COUNT(c.id) as TotalClicks'))
        ->join('shortlinks', 'c.shortlink_id', '=', 'shortlinks.id')
        ->whereRaw('c.created_at >= current_date() + INTERVAL -6 DAY AND c.created_at <  current_date() + INTERVAL 1 DAY and shortlinks.user_id = ?', [$userID])
        ->get();

        $totalLinks = DB::table('links')
        ->select(DB::raw('COUNT(*) as TotalLinks'))
        ->whereRaw('created_at >= current_date() + INTERVAL -6 DAY AND created_at <  current_date() + INTERVAL  1 DAY and user_id = ?', [$userID])
        ->get();



        $clicksData = DB::table('clicks as c')
        ->select(DB::raw("DATE_FORMAT(c.created_at, '%m/%d') AS date, count(c.id) as total, 'click' as 'type'"))
        ->join('shortlinks as s', 'c.shortlink_id', '=', 's.id')
        ->whereRaw('c.created_at >= current_date() + INTERVAL -6 DAY AND c.created_at <  current_date() + INTERVAL 1 DAY and s.user_id = ?', [$userID])
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

        $linksData = DB::table('links as l')
        ->select(DB::raw("DATE_FORMAT(l.created_at, '%m/%d') AS date, count(l.id) as total, 'link' as 'type'"))
        ->whereRaw('created_at >= current_date() + INTERVAL -6 DAY AND created_at <  current_date() + INTERVAL  1 DAY and user_id = ?', [$userID])
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();
        $chartData = [];

        foreach($linksData as $v){
            array_push($chartData, $v);
        }
        foreach($clicksData as $v){
            array_push($chartData, $v);
        }

        

        return response()->json([ 
            "totalClicks" => $totalClicks[0]->TotalClicks,
            "totalLinks" => $totalLinks[0]->TotalLinks,
            "chartData" => $chartData,
            "linksData" => $linksData,
            "clicksData" => $clicksData
        ]);
    }
    public function graphql(Request $request){
        
        $shop = Auth::user();
        // $request = $shop->api()->rest('GET', '/admin/shop.json');
        $request = $shop->api()->graph($request->input('query'));
          return json_encode($request['body']['data']) ;
    }
    
}
  