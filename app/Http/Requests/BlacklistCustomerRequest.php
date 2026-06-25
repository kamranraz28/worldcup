<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlacklistCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->hasPermission('customers.blacklist') : false;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:500'],
            'duration_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
        ];
    }
}
