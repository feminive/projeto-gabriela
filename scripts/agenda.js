import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.resolve("src/content/posts");

const getFilesRecursively = (dir) => {
	let results = [];
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			results = results.concat(getFilesRecursively(filePath));
		} else if (file.endsWith(".md")) {
			results.push(filePath);
		}
	});
	return results;
};

const formatDateToDDMMAA = (dateStr) => {
	if (!dateStr || dateStr === "(sem data)") return "(sem data)";
	try {
		const date = new Date(dateStr);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = String(date.getFullYear()).slice(-2);
		return `${day}/${month}/${year}`;
	} catch (error) {
		return "(data inválida)";
	}
};

const getDraftPosts = () => {
	const draftPosts = [];

	getFilesRecursively(postsDir).forEach((filePath) => {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const { data } = matter(fileContent, { excerpt: false });

		if (data.draft === true) {
			const postDate = data.published
				? new Date(data.published).toISOString().split("T")[0]
				: "(sem data)";
			const isRestricted = data.restricted === true;
			const restrictedSymbol = isRestricted ? "🟩" : "⬛️"; // Sempre 1 caractere visível

			draftPosts.push({
				filePath,
				title: data.title,
				category: data.category || "(sem categoria)",
				restricted: restrictedSymbol,
				date: postDate,
				formattedDate: formatDateToDDMMAA(data.published),
			});
		}
	});
	return draftPosts;
};

const draftPosts = getDraftPosts();

// Ordena os posts: primeiro o mais recente, depois o mais antigo
draftPosts.sort((a, b) => {
	if (a.date === "(sem data)") return 1;
	if (b.date === "(sem data)") return -1;
	return new Date(a.date) - new Date(b.date);
});

if (draftPosts.length === 0) {
	console.log("Nenhum post com draft: true encontrado.");
	process.exit(0);
}

// Ajusta dinamicamente o tamanho das colunas baseado nos dados
const colWidths = {
	date: 12,
	category: 24,
	restricted: 3, // Emojis agora sempre ocupam 1 espaço visível
	title: 45,
};

// Função auxiliar para desenhar uma linha horizontal
const drawLine = () => {
	console.log(
		`+${"-".repeat(colWidths.date + 2)}+${"-".repeat(colWidths.category + 2)}+${"-".repeat(colWidths.restricted + 2)}+${"-".repeat(colWidths.title + 2)}+`,
	);
};

// Cabeçalho da tabela
console.log("\nOs seguintes posts estão como rascunho:\n");
drawLine();
console.log(
	`| ${"Data".padEnd(colWidths.date)} | ${"Novela".padEnd(colWidths.category)} | ${"VIP".padEnd(colWidths.restricted)} | ${"Título".padEnd(colWidths.title)} |`,
);
drawLine();

// Preenchendo os dados
draftPosts.forEach((post) => {
	const vscodeLink = `vscode://file/${post.filePath}`;
	console.log(
		`| ${post.formattedDate.padEnd(colWidths.date)} | ` +
			`${post.category.padEnd(colWidths.category)} | ` +
			`${post.restricted}  | ` + // Mantém espaço fixo
			`\x1b[34m\x1b]8;;${vscodeLink}\x1b\\${post.title.padEnd(colWidths.title)}\x1b]8;;\x1b\\\x1b[0m |`,
	);
});
drawLine();
// Contagem de posts por categoria
const categoryCounts = {};

draftPosts.forEach((post) => {
	const category = post.category;
	categoryCounts[category] = (categoryCounts[category] || 0) + 1;
});

console.log("Resumo por novela (categoria):\n");
Object.entries(categoryCounts)
	.sort((a, b) => b[1] - a[1]) // Ordena da maior para a menor
	.forEach(([category, count]) => {
		console.log(`- ${category}: ${count} post${count > 1 ? "s" : ""}`);
	});

console.log("\n");
