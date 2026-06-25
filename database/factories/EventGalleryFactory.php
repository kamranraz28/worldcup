<?php

namespace Database\Factories;

use App\Models\EventGallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventGalleryFactory extends Factory
{
    protected $model = EventGallery::class;

    public function definition(): array
    {
        return [
            'image_path' => 'events/gallery/' . fake()->uuid() . '.jpg',
            'caption' => fake()->optional(0.6)->sentence(),
            'order' => fake()->numberBetween(0, 20),
        ];
    }
}
