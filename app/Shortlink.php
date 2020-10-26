<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shortlink extends Model
{
    public function link()
    {
        return $this->belongsTo('App\Link');
    }
}
