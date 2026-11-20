<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(User $admin): void
    {
        // Sample news posts for development.
        $posts = [
            [
                'title' => 'Wet season planting gets under way',
                'body' => 'Farmers across the Tonle Sap region have started transplanting seedlings as the rains arrive. Fragrant varieties such as Phka Rumduol remain the most popular choice for this season.',
                'image' => 'extra/cambodia rice farmer.jpg',
                'isTrending' => true,
            ],
            [
                'title' => 'Fragrant rice prices hold steady in Phnom Penh',
                'body' => 'Jasmine rice prices at major Phnom Penh markets were broadly unchanged this week, while black and red rice continued to command a premium. See the Prices page for the latest figures by province.',
                'image' => 'extra/ricefields.png',
                'isTrending' => true,
            ],
            [
                'title' => 'Tips for storing milled rice after harvest',
                'body' => 'Keep milled rice in sealed, airtight containers in a cool, dry place. Proper storage protects grain quality and helps farmers wait for better prices instead of selling immediately after harvest.',
                'image' => 'extra/ricelandscape.jpg',
                'isTrending' => false,
            ],
            [
                'title' => 'Rice: the heart and soul of Cambodia',
                'body' => 'From family meals to festivals, rice is woven into everyday life in Cambodia. This series looks at the farmers, markets and traditions behind the country\'s most important crop.',
                'image' => 'riceheartandsoul/heartandsoul_4.jpg',
                'isTrending' => false,
            ],
        ];

        foreach ($posts as $data) {
            $data['image'] = DatabaseSeeder::storeImage($data['image'], 'posts');

            Post::updateOrCreate(
                ['title' => $data['title']],
                $data + ['user_id' => $admin->id],
            );
        }
    }
}
