<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('links', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('original_content_title');
            $table->longText('link_url');
            $table->string('campaign_source')->nullable();
            $table->string('campaign_medium')->nullable();
            $table->string('campaign_name')->nullable();
            $table->string('campaign_term')->nullable();
            $table->string('campaign_content')->nullable();
            $table->string('discount_code')->nullable();
            $table->longText('original_content_url');
            $table->string('link_type');
            $table->longText('link_img_url')->nullable();
            $table->longText('original_content_id')->nullable();
            $table->bigInteger('user_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('links', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('links');
    }
}
