<?php

namespace App\Http\Controllers;

use App\Link;
use Illuminate\Http\Request;
use Auth;

class LinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $links = Link::all();
        $user = Auth::user();
        $user->links();
        return $user->links()->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // return "Saved Data";
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {   
        $link = new Link;
        $link->campaign_source = $request->campaign_source;
        $link->campaign_medium = $request->campaign_medium;
        $link->campaign_name = $request->campaign_name;
        $link->campaign_term = $request->campaign_term;
        $link->campaign_content = $request->campaign_content;
        $link->discount_code = $request->discount_code;
        $link->original_content_url = $request->original_content_url;
        $link->original_content_title = $request->original_content_title;
        $link->link_type = $request->link_type;
        $link->user_id = $request->user_id;

        if($request->link_type != 'custom') {
            $link->original_content_id = $request->original_content_id;
            $link->link_img_url = $request->link_img_url;
        } 
        
        $link->save();
        return "Saved Data";
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\link  $link
     * @return \Illuminate\Http\Response
     */
    public function show(link $link)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\link  $link
     * @return \Illuminate\Http\Response
     */
    public function edit(link $link)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\link  $link
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, link $link)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\link  $link
     * @return \Illuminate\Http\Response
     */
    public function destroy(link $link)
    {
        //
    }
}
