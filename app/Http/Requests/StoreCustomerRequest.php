<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('create', \App\Models\Customer::class) : true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('customers', 'email')],
            'phone' => ['required', 'string', 'max:20', Rule::unique('customers', 'phone')],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'nationality' => ['nullable', 'string', 'size:3'],
            'document_type' => ['nullable', Rule::in(['passport', 'national_id', 'drivers_license'])],
            'document_number' => ['nullable', 'string', 'max:50', Rule::unique('customers', 'document_number')],
            'metadata' => ['nullable', 'json'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'A customer with this email already exists.',
            'phone.unique' => 'A customer with this phone number already exists.',
            'date_of_birth.before' => 'Date of birth must be in the past.',
            'nationality.size' => 'Nationality must be a 3-letter country code.',
        ];
    }
}
