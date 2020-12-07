<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('shopify-app.app_name') }}</title>
        <link rel="stylesheet" href="{{secure_asset('template/main.css')}}">
        <link rel="stylesheet" href="{{secure_asset('css/app.css')}}">
        @yield('styles')
    </head>

    <body>
    TESTING
        <div class="app-wrapper">
            <div class="app-content">
                <main role="main">
                    @yield('content')
                </main>
            </div>
        </div>

        {{-- @if(config('shopify-app.appbridge_enabled'))
            <script src="https://unpkg.com/@shopify/app-bridge{{ config('shopify-app.appbridge_version') ? '@'.config('shopify-app.appbridge_version') : '' }}"></script>
            <script>
                var AppBridge = window['app-bridge'];
                var createApp = AppBridge.default;
                var app = createApp({
                    apiKey: '{{ config('shopify-app.api_key') }}',
                    shopOrigin: '{{ Auth::user()->name }}',
                    forceRedirect: true,
                });
            </script>

            @include('shopify-app::partials.flash_messages')
        @endif --}}

        <input type="hidden" id="apiKey" value="{{ config('shopify-app.api_key') }}">
        <input type="hidden" id="shopOrigin" value="{{ Auth::user()->name }}">
        <input type="hidden" id="userId" value="{{ Auth::user()->id }}">
        <script src="{{secure_asset('js/app.js')}}"></script>
        @yield('scripts')
    </body>
</html>