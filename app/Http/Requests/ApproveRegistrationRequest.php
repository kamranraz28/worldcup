<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApproveRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('update', \App\Models\Ticket::class) : false;
    }

    public function rules(): array
    {
        return [
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
