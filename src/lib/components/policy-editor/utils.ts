export function formatPolicyForBunker(policy: App.Policy) {
    return JSON.stringify({
        name: policy.name,
        description: policy.description,
        rules: policy.rules.map(r => ({
            method: r.method,
            kind: r.kind,
            use_count: r.useCount,
            expires_at: r.expiresAt?.toISOString(),
        })),
    });
}

export function formatRuleMethod(method: string) {
    switch (method) {
        case "sign_event": return "Sign events";
        case "nip04_encrypt": return "Encrypt data";
        case "nip04_decrypt": return "Decrypt data";
        default: return method;
    }
}

export function kindToRule(kind: number | string) {
    switch (kind) {
        case "all": return "Grant all permissions";
        case 0: return "Modify metadata (name, bio, etc.)";
        case 1: return "Write short-notes";
        case 3: return "Follow/unfollow + modify relay configuration";
        case 4: return "Send DMs";
        case 7: return "Create reactions (likes, etc.)";
        case 9734: return "Send zaps";
        case 9802: return "Create highlights";
        case 10002: return "Relay list metadata";
        case 30001: return "Edit list";
        case 30023: return "Publish long-form articles";
        case 31989: return "Recommend application handler";

        default: return kind;
    }
}