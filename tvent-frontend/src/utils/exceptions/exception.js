export function extractErrorMessage(error, fallback = 'Something went wrong') {
    if (!error || typeof error.message !== 'string') return fallback;

    const lines = error.message.split('\n').map(line => line.trim()).filter(Boolean);
    return lines.length > 0 ? lines[0] : fallback;
}

export const handleApiError = (data) => {
    const errors = data?.errors
    if (errors) {
        const errorList = Object.values(errors).flat().join('\n')
        throw new Error(errorList)
    }
    throw new Error(data.message || 'Request failed')
}