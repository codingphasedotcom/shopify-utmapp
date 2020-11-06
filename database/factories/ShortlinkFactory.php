<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Shortlink;
use Faker\Generator as Faker;

$factory->define(Shortlink::class, function (Faker $faker) {
    return [
        'link_id' => factory(App\Link::class),
        'user_id' => 1,
        'slug' => uniqid(),
        'created_at' => function(array $shortlink) {
            return App\Link::find($shortlink['link_id'])->created_at;
        },
        'updated_at' => function(array $shortlink) {
            return App\Link::find($shortlink['link_id'])->updated_at;
        }
    ];
});
