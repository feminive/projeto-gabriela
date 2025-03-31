// src/utils/sanitizeComments.ts

export function validateComment(content, recentComments = []) {
	const normalized = content.trim();

	if (normalized.length < 5) {
		return { valid: false, reason: "Comentário muito curto." };
	}

	if (normalized.length > 500) {
		return {
			valid: false,
			reason: "Comentário muito longo. Limite de 500 caracteres.",
		};
	}

	const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}/i;
	if (emailRegex.test(normalized)) {
		return { valid: false, reason: "Comentário não pode conter e-mail." };
	}

	const urlRegex = /(https?:\/\/|www\.)[\w.-]+/gi;
	if (urlRegex.test(normalized)) {
		return { valid: false, reason: "Links e sites não são permitidos." };
	}

	const meaningful = normalized
		.replace(/[\\p{P}\\p{S}\\p{Emoji}]/gu, "")
		.trim();
	if (meaningful.length < 3) {
		return {
			valid: false,
			reason: "Comentário precisa ter mais conteúdo significativo.",
		};
	}

	if (recentComments.includes(normalized)) {
		return { valid: false, reason: "Comentário duplicado." };
	}

	return { valid: true };
}
