<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('update', $this->route('customer')) : false;
    }

    public function rules(): array
    {
        $customer = $this->route('customer');
        $customerId = $customer ? $customer->id : null;

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customerId)],
            'phone' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('customers', 'phone')->ignore($customerId)],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'nationality' => ['nullable', 'string', 'size:3'],
            'document_type' => ['nullable', Rule::in(['passport', 'national_id', 'drivers_license'])],
            'document_number' => ['nullable', 'string', 'max:50', Rule::unique('customers', 'document_number')->ignore($customerId)],
            'metadata' => ['nullable', 'json'],
        ];
    }
}
