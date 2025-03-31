document.addEventListener("DOMContentLoaded", async () => {
	const auth0Client = await auth0.createAuth0Client({
		domain: "dev-6brtlssmpiy5lg8p.us.auth0.com",
		clientId: "2ujzHWQhbUKaXPxJHtDi7YM3HYq0Tl2g",
		authorizationParams: {
			redirect_uri: window.location.origin + "/callback.html",
		},
		cacheLocation: "localstorage",
		useRefreshTokens: true,
	});

	const loginBtn = document.getElementById("login");
	const profileEl = document.getElementById("profile");
	const profileImg = document.getElementById("profile-img");

	if (window.location.pathname === "/callback.html") {
		await auth0Client.handleRedirectCallback();
		window.history.replaceState({}, document.title, "/");
	}

	const isAuthenticated = await auth0Client.isAuthenticated();

	if (isAuthenticated) {
		const userProfile = await auth0Client.getUser();
		const userEmail = userProfile.email;

		localStorage.setItem("userEmail", userEmail);

		let isSubscribed = sessionStorage.getItem("isSubscribed");

		if (!isSubscribed) {
			try {
				const response = await fetch(
					`https://stripe-api-gamma.vercel.app/verificar-assinatura?email=${userEmail}`,
				);
				const data = await response.json();
				console.log("Dados da assinatura:", data);
				isSubscribed = data.active ? "true" : "false";
				sessionStorage.setItem("isSubscribed", isSubscribed);
			} catch (error) {
				console.error("Erro ao verificar assinatura:", error);
			}
		}

		loginBtn.style.display = "none";
		profileEl.style.display = "block";

		if (profileImg) {
			profileImg.src = userProfile.picture;
			profileImg.alt = "Perfil";
			profileImg.style.width = "40px";
			profileImg.style.height = "40px";
			profileImg.style.borderRadius = "50%";
			profileImg.style.cursor = "pointer";
		}

		profileImg?.addEventListener("click", async (e) => {
			e.preventDefault();
			window.location.href = "/painel/";
		});
	} else {
		loginBtn.style.display = "block";
		profileEl.style.display = "none";
	}

	loginBtn?.addEventListener("click", async (e) => {
		e.preventDefault();
		await auth0Client.loginWithRedirect({
			authorizationParams: {
				redirect_uri: window.location.origin + "/callback.html",
				prompt: "login",
			},
		});
	});

	document
		.getElementById("logout-button")
		?.addEventListener("click", async () => {
			localStorage.removeItem("userEmail");
			localStorage.clear();
			sessionStorage.clear();

			await auth0Client.logout({
				logoutParams: {
					returnTo: window.location.origin,
					federated: true,
				},
			});
		});
});
