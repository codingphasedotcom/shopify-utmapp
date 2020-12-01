<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ShortlinkSeeder::class);
        $this->call(ClickSeeder::class);
        $this->call(PlanSeeder::class);
    }
}
