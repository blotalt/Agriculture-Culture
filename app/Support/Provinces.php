<?php

namespace App\Support;

class Provinces
{
    public static function all(): array
    {
        return config('provinces');
    }

    // Look a province up by its name or any known spelling, case-insensitively.
    public static function find(?string $name): ?array
    {
        if (! $name) {
            return null;
        }

        $needle = self::normalize($name);

        foreach (self::all() as $province) {
            foreach ([$province['name'], ...$province['aliases']] as $candidate) {
                if (self::normalize($candidate) === $needle) {
                    return $province;
                }
            }
        }

        return null;
    }

    // The standard spelling, or the input unchanged if it is not a known province.
    public static function canonical(string $name): string
    {
        return self::find($name)['name'] ?? $name;
    }

    private static function normalize(string $name): string
    {
        return strtolower(preg_replace('/[^a-z]/i', '', $name));
    }
}
