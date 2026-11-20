<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Variety;
use Illuminate\Database\Seeder;

class VarietySeeder extends Seeder
{
    public function run(?User $admin = null): void
    {
        if (! $admin?->exists) {
            $admin = User::where('is_admin', true)->oldest('id')->firstOrFail();
        }

        foreach (self::varieties() as $data) {
            if ($data['image']) {
                $data['image'] = DatabaseSeeder::storeImage($data['image'], 'ricetypes');
            }

            Variety::updateOrCreate(
                ['name' => $data['name']],
                $data + ['user_id' => $admin->id],
            );
        }
    }

    public static function varieties(): array
    {
        // Sample data. Figures backed by a published source list it under 'sources', with the facts
        // it confirms; anything not listed there is shown on the site as "not yet confirmed".
        // Sources checked on 6 Oct 2026.
        $nader2020 = [
            'title' => 'The DNA fingerprint in food forensics part II: the Jasmine rice case',
            'publisher' => 'Agro FOOD Industry Hi Tech 31(1); W. Nader, Ouk Makara (CARDI) et al.',
            'date' => '2020',
            'url' => 'https://cdnmedia.eurofins.com/european-east/media/2853910/2002_dna-fingerprinting_jasmine-rice_agro-food-industry-hi-tech.pdf',
        ];
        $kongThong2020 = [
            'title' => 'Cooking and Eating Qualities of Phka Rumduol, A Leading Variety of Cambodian Rice',
            'publisher' => 'Food Science and Technology Research 26(3); Kong Thong et al.',
            'date' => '2020',
            'url' => 'https://doi.org/10.3136/fstr.26.373',
        ];

        return [
            [
                'name' => 'Phka Rumduol',
                'khmer_name' => 'ផ្ការំដួល',
                'type' => 'Jasmine',
                'location' => 'Battambang',
                'description' => 'Premium fragrant jasmine rice with long, soft grains. Cambodia\'s best-known export variety.',
                'yield' => '3.5 - 5 t/ha',
                'cycle' => '130 - 140 days',
                'harvest' => 'Nov - Jan',
                'season' => 'Wet season',
                'demand' => 'Very High',
                'image' => 'ricetypes/jasmine.png',
                'sources' => [
                    [
                        'title' => 'Cambodia rice variety named world\'s best',
                        'publisher' => 'IRRI News',
                        'date' => '2014-01-30',
                        'url' => 'https://news.irri.org/2014/01/cambodia-rice-variety-named-worlds-best.html',
                        'note' => 'Released by CARDI in 1999; jasmine-type aroma; typically 3.5-5 t/ha in rainfed lowland fields.',
                        'confirms' => ['type', 'yield'],
                    ],
                    [
                        'title' => 'Rice Qualities in Cambodian Markets: Market Survey on Qualities of Phka Rumduol and Somali in Takeo, Phnom Penh and Battambang, Cambodia',
                        'publisher' => 'Food Science and Technology Research 26(2); Ek Sopheap et al.',
                        'date' => '2020',
                        'url' => 'https://www.jstage.jst.go.jp/article/fstr/26/2/26_223/_html/-char/en',
                        'note' => 'Rain-fed lowland rice, harvested once a year from early November to mid-January.',
                        'confirms' => ['season', 'harvest'],
                    ],
                    $kongThong2020 + [
                        'note' => 'Developed from a local variety and released by CARDI; sold as "fragrant rice premium jasmine (wet season)".',
                        'confirms' => ['type'],
                    ],
                    $nader2020 + [
                        'note' => 'CARDI selected Phka Rumduol from traditional landraces; a wet-season variety.',
                        'confirms' => ['season'],
                    ],
                ],
            ],
            [
                'name' => 'Sen Kra Ob',
                'khmer_name' => 'សែនក្រអូប',
                'type' => 'Jasmine',
                'location' => 'Takeo',
                'description' => 'Short-cycle fragrant rice that can be grown in both seasons, popular with smallholder farmers.',
                'yield' => '4 - 5 t/ha',
                'cycle' => '105 - 115 days',
                'season' => 'Wet and dry season',
                'demand' => 'High',
                'image' => 'ricetypes/fragrant.jpg',
                'sources' => [
                    [
                        'title' => 'Siem Reap preps harvest of Cambodia\'s first Sen Kra\'op rice variation',
                        'publisher' => 'Phnom Penh Post',
                        'date' => '2023-03-27',
                        'url' => 'https://phnompenhpost.com/national/siem-reap-preps-harvest-cambodias-first-sen-kraop-rice-variation/',
                        'note' => 'Released by CARDI in 2019; the Ministry of Agriculture says it can be grown in any season and yields 4-5 tonnes per hectare.',
                        'confirms' => ['yield', 'season'],
                    ],
                    [
                        'title' => 'CARDI explain popularity of fragrant Sen Kra\'op rice',
                        'publisher' => 'Phnom Penh Post',
                        'date' => '2023-10-24',
                        'url' => 'https://phnompenhpost.com/business/cardi-explain-popularity-fragrant-sen-kraop-rice/',
                        'note' => 'Grown by 40% of Cambodia\'s rice farmers, with high demand in China and Europe; non-seasonal; 3.29-6 t/ha depending on soil and water (CARDI director).',
                        'confirms' => ['demand', 'season'],
                    ],
                    [
                        'title' => 'Cambodian farmers urged to prioritise local rice varieties as prices surge',
                        'publisher' => 'Phnom Penh Post, via Asia News Network',
                        'date' => '2024-09-12',
                        'url' => 'https://asianews.network/cambodian-farmers-urged-to-prioritise-local-rice-varieties-as-prices-surge/',
                        'note' => 'Sen Kra-Ob takes about 110 days to harvest.',
                        'confirms' => ['cycle'],
                    ],
                ],
            ],
            [
                'name' => 'Phka Malis',
                'khmer_name' => 'ផ្កាម្លិះ',
                'type' => 'Jasmine',
                'location' => 'Prey Veng',
                'description' => 'Aromatic white rice with a delicate texture, widely sold in local markets.',
                'yield' => '3 - 4 t/ha',
                'cycle' => '125 - 135 days',
                'season' => 'Wet season',
                'demand' => 'High',
                'image' => null,
                'sources' => [
                    $kongThong2020 + [
                        'note' => 'Phka Malis is sold in the market category "fragrant rice premium jasmine (wet season)", together with Phka Rumduol and Phka Romeat.',
                        'confirms' => ['type', 'season'],
                    ],
                    $nader2020 + [
                        'note' => 'Neang Malis is a trade name for Phka Malis; a CARDI reference sample was mainly the cultivar Phka Romeat.',
                        'confirms' => ['type'],
                    ],
                ],
            ],
            [
                'name' => 'Cambodian Black Rice',
                'khmer_name' => 'អង្ករខ្មៅ',
                'type' => 'Black Rice',
                'location' => 'Mondulkiri',
                'description' => 'Deep purple-black grain rich in antioxidants, with a nutty flavour.',
                'yield' => '2 - 3 t/ha',
                'cycle' => '120 - 130 days',
                'season' => 'Wet season',
                'demand' => 'Medium',
                'image' => 'ricetypes/blackrice.jpg',
            ],
            [
                'name' => 'Damnaeb Sticky Rice',
                'khmer_name' => 'អង្ករដំណើប',
                'type' => 'Glutinous',
                'location' => 'Kampong Thom',
                'description' => 'Glutinous rice used for traditional desserts and festival dishes such as num ansom.',
                'yield' => '3 - 4 t/ha',
                'cycle' => '120 - 130 days',
                'season' => 'Wet season',
                'demand' => 'High',
                'image' => 'ricetypes/glutinous.png',
            ],
            [
                'name' => 'Organic Brown Rice',
                'khmer_name' => 'អង្ករសំរូប',
                'type' => 'Brown Rice',
                'location' => 'Kampong Speu',
                'description' => 'Unpolished whole-grain rice that keeps the bran layer, higher in fibre.',
                'yield' => '3 - 3.5 t/ha',
                'cycle' => '120 - 130 days',
                'season' => 'Wet season',
                'demand' => 'Medium',
                'image' => 'ricetypes/brown-rice.jpg',
            ],
            [
                'name' => 'Cambodian Red Rice',
                'khmer_name' => 'អង្ករក្រហម',
                'type' => 'Whole-grain',
                'location' => 'Ratanakiri',
                'description' => 'Upland red rice with an earthy taste, often grown by highland communities.',
                'yield' => '1.5 - 2.5 t/ha',
                'cycle' => '130 - 150 days',
                'season' => 'Wet season',
                'demand' => 'Low',
                'image' => 'ricetypes/red-rice.jpg',
            ],
        ];
    }
}
