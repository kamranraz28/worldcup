<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GalleryUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('update', $this->route('event')) : false;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'image.max' => 'Gallery images must not be larger than 5MB.',
        ];
    }
}
