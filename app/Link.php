<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    public function user()
    {
        return $this->belongsTo('App\User');
    }
    public function shortlink()
    {
        return $this->hasOne('App\Models\Shortlink');
    }
    public function clicks()
    {
        return $this->hasManyThrough(
            'App\Models\Click',
            'App\Models\Shortlink',
            'link_id', // Foreign key on shortlinks table...
            'shortlink_id', // Foreign key on clicks table...
            'id', // Local key on links table...
            'id' // Local key on shortlinks table...
        );
    }
}
