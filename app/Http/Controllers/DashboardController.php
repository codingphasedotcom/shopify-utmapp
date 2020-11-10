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
        // SELECT COUNT(c.id) FROM utmapp.clicks as c  
        // INNER JOIN     
        // utmapp.shortlinks AS s     
        // ON c.shortlink_id = s.id  
        // WHERE c.created_at BETWEEN NOW() - INTERVAL 6 DAY AND NOW() 
        // AND s.user_id = 3 
        $userID = Auth::id();
        $totalClicks = DB::table('clicks as c')
        ->select(DB::raw('COUNT(c.id) as TotalClicks'))
        ->join('shortlinks', 'c.shortlink_id', '=', 'shortlinks.id')
        ->whereRaw('c.created_at >= DATE(NOW()) + INTERVAL -6 DAY AND c.created_at <  NOW() + INTERVAL  0 DAY and shortlinks.user_id = ?', [$userID])
        ->get();

        $totalLinks = DB::table('links')
        ->select(DB::raw('COUNT(*) as TotalLinks'))
        ->whereRaw('created_at >= DATE(NOW()) + INTERVAL -6 DAY AND created_at <  NOW() + INTERVAL  0 DAY and user_id = ?', [$userID])
        ->get();
        return response()->json([ 
            "totalClicks" => $totalClicks[0]->TotalClicks,
            "totalLinks" => $totalLinks[0]->TotalLinks,
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
  