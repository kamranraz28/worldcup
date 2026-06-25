<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('create', \App\Models\Event::class) : false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:10000'],
            'event_type' => ['required', Rule::in(['live', 'virtual', 'hybrid'])],
            'venue_name' => ['nullable', 'string', 'max:255'],
            'venue_address' => ['nullable', 'string', 'max:500'],
            'venue_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'venue_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'max_capacity' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'ticket_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'start_date' => ['required', 'date', 'after:now'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'registration_deadline' => ['nullable', 'date', 'before_or_equal:start_date', 'after:now'],
            'banner_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'requires_verification' => ['nullable', 'boolean'],
            'metadata' => ['nullable', 'json'],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.after' => 'The event start date must be in the future.',
            'end_date.after' => 'The end date must be after the start date.',
            'registration_deadline.before_or_equal' => 'The registration deadline must be on or before the start date.',
            'banner_image.max' => 'The banner image must not be larger than 2MB.',
        ];
    }
}
