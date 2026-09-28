<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('vouchers', 'code')],
            'description' => ['nullable', 'string', 'max:255'],
            'discount_percent' => ['required', 'numeric', 'min:0.01', 'max:100'],
            'max_uses' => ['required', 'integer', 'min:1', 'max:1000000'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'A voucher with this code already exists.',
            'discount_percent.max' => 'The discount cannot exceed 100%.',
            'expires_at.after_or_equal' => 'The expiry date must be on or after the start date.',
        ];
    }
}
