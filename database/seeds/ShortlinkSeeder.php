<?php

use Illuminate\Database\Seeder;

class ShortlinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shortlinks = factory(App\Shortlink::class, 20)->create();
    }
}
