<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'verification_type' => ['required', Rule::in(['identity', 'address', 'age', 'ticket_eligibility'])],
            'document_front' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'document_back' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'selfie_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'ocr_data' => ['nullable', 'json'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'document_front.max' => 'Document image must not be larger than 5MB.',
            'document_back.max' => 'Document image must not be larger than 5MB.',
            'selfie_image.max' => 'Selfie image must not be larger than 5MB.',
        ];
    }
}
