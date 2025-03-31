import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.resolve("src/content/posts");
const scriptsDir = path.resolve("scripts"); // Diretório para salvar os arquivos

const wordsToRemove = ["pedofilia", "incesto", "incestuosa"]; // Palavras a serem removidas

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

const getPosts = () => {
	return getFilesRecursively(postsDir).map((filePath) => {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const { data, content } = matter(fileContent);

		let filteredContent = content;
		wordsToRemove.forEach((word) => {
			const regex = new RegExp(`\\b${word}\\b`, "gi");
			filteredContent = filteredContent.replace(regex, "");
		});

		return {
			title: data.title,
			category: data.category,
			content: `Title: ${data.title}\n\n${filteredContent.replace(/\s+/g, " ").trim()}\n\n---\n`,
		};
	});
};

const categoryArg = process.argv[2]; // Obtém o argumento passado
const posts = getPosts();

let filteredPosts = [];
let outputFile;

if (categoryArg && categoryArg !== "all") {
	filteredPosts = posts.filter(
		(post) =>
			post.category?.trim().toLowerCase() === categoryArg.trim().toLowerCase(),
	);
	if (filteredPosts.length > 0) {
		outputFile = path.resolve(
			scriptsDir,
			`${categoryArg.replace(/\s+/g, "_")}.txt`,
		);
	} else {
		console.log(`Nenhum post encontrado para a categoria: ${categoryArg}`);
		process.exit(1);
	}
} else {
	filteredPosts = posts;
	outputFile = path.resolve(scriptsDir, "blogEntries.txt");
}

const blogEntries = filteredPosts.map((post) => post.content).join("\n");
fs.writeFileSync(outputFile, blogEntries, "utf-8");

console.log(`Arquivo salvo em: ${outputFile}`);

// Cálculo das estatísticas do texto
const totalCharacters = blogEntries.length;
const totalWords = blogEntries.split(/\s+/).filter((word) => word).length;

// Tempo estimado de leitura: usando 200 palavras por minuto
const wordsPerMinute = 200;
const totalTimeMinutes = totalWords / wordsPerMinute;
const totalTimeSeconds = totalTimeMinutes * 60;

// Converter para dias, horas, minutos e segundos
const days = Math.floor(totalTimeSeconds / (24 * 60 * 60));
const hours = Math.floor((totalTimeSeconds % (24 * 60 * 60)) / 3600);
const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
const seconds = Math.round(totalTimeSeconds % 60);

// Exibir resultados com formatação pt-BR
console.log(`Total de posts: ${filteredPosts.length.toLocaleString("pt-BR")}`);
console.log(`Total de caracteres: ${totalCharacters.toLocaleString("pt-BR")}`);
console.log(`Total de palavras: ${totalWords.toLocaleString("pt-BR")}`);
console.log(
	`Tempo estimado de leitura: ${days.toLocaleString("pt-BR")} dia(s), ${hours.toLocaleString("pt-BR")} hora(s), ${minutes.toLocaleString("pt-BR")} minuto(s) e ${seconds.toLocaleString("pt-BR")} segundo(s)`,
);
