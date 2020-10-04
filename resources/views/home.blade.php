@extends('shopify-app::layouts.default')

@section('content')
    <!-- You are: (shop domain name) -->
    <p>You are: {{ Auth::user()->name }}</p>
    <div id="app"></div>
@endsection

@section('scripts')
    @parent

@endsection