<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with sample content.
     * Safe to run more than once: rows are matched and updated, not duplicated.
     */
    public function run(): void
    {
        $admin = User::where('name', 'admin')->first();

        if (! $admin) {
            $password = env('SEED_ADMIN_PASSWORD') ?: Str::random(12);

            $admin = User::create([
                'name' => 'admin',
                'email' => 'admin@khmerrice.local',
                'password' => $password,
            ]);

            // is_admin is deliberately not fillable, so set it explicitly.
            $admin->forceFill(['is_admin' => true])->save();

            $this->command->warn("Created admin user: admin / {$password}  (change it after logging in)");
        }

        $this->call([
            VarietySeeder::class,
            MarketPriceSeeder::class,
            PostSeeder::class,
            LearnSeeder::class,
        ], parameters: ['admin' => $admin]);
    }

    /**
     * Copy an image shipped in public/images into the public storage disk,
     * where uploaded images live, and return its storage path.
     */
    public static function storeImage(string $source, string $folder): ?string
    {
        $from = public_path('images/'.$source);

        if (! File::exists($from)) {
            return null;
        }

        $path = $folder.'/'.Str::slug(pathinfo($source, PATHINFO_FILENAME)).'.'.pathinfo($source, PATHINFO_EXTENSION);
        Storage::disk('public')->put($path, File::get($from));

        return $path;
    }
}
