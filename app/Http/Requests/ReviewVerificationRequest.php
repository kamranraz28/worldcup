<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() ? $this->user()->can('review', $this->route('verification')) : false;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject,flag'],
            'rejection_reason' => ['required_if:action,reject,flag', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'confidence_score' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required_if' => 'A reason is required when rejecting or flagging a verification.',
        ];
    }
}
