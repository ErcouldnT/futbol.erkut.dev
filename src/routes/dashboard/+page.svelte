<script lang="ts">
	import { goto } from "$app/navigation";

	export let data;
	const supabase = data.supabase;

	let newPlayerName = "";
	let newPlayerId = "";
	let newPlayerNumber = "";
	let playerModal: HTMLDialogElement;
	let editPlayerModal: HTMLDialogElement;
	let allPlayers = [];
	let selectedPlayerId = null;
	let editPlayerName = "";
	let editPlayerNumber = "";
	let newTeamName = "";
	let teamModal: HTMLDialogElement;

	let matchModal: HTMLDialogElement;
	let matchTitle = "";
	let team1 = "";
	let team2 = "";
	let homeScore = 0;
	let awayScore = 0;
	let duration = "";
	let isVotable = false;
	let matchTime = "";

	let editMatchModal: HTMLDialogElement;
	let allMatches = [];
	let selectedMatchId = null;

	let editMatchTitle = "";
	let editTeam1 = "";
	let editTeam2 = "";
	let editHomeScore = 0;
	let editAwayScore = 0;
	let editDuration = "";
	let editIsVotable = false;
	let editMatchTime = "";

	let editTeamModal: HTMLDialogElement;
	let allTeams = [];
	let selectedTeamId = null;
	let editTeamName = "";
	let teamLineup = [];
	let allPlayersForLineup = [];
	let selectedPlayerForLineup = "";

	async function handleLogout() {
		await supabase.auth.signOut();
		goto("/");
	}

	async function createPlayer() {
		const { error } = await supabase.from("players").insert({
			id: newPlayerId,
			name: newPlayerName,
			number: Number(newPlayerNumber)
		});

		if (error) {
			alert("Oyuncu eklenemedi: " + error.message);
		} else {
			newPlayerName = "";
			newPlayerId = "";
			newPlayerNumber = "";
			playerModal?.close();
		}
	}

	async function openEditPlayerModal() {
		const { data, error } = await supabase.from("players").select("*");
		if (!error) {
			allPlayers = data;
			editPlayerModal.showModal();
		}
	}

	function selectPlayer(player) {
		selectedPlayerId = player.id;
		editPlayerName = player.name;
		editPlayerNumber = player.number;
	}

	async function updatePlayer() {
		if (!selectedPlayerId) return;

		const { error } = await supabase
			.from("players")
			.update({
				name: editPlayerName,
				number: editPlayerNumber
			})
			.eq("id", selectedPlayerId);

		if (error) {
			alert("Oyuncu güncellenemedi: " + error.message);
		} else {
			editPlayerModal.close();
		}
	}

	async function createTeam() {
		const { error } = await supabase.from("teams").insert({
			name: newTeamName
		});

		if (error) {
			alert("Takım eklenemedi: " + error.message);
		} else {
			newTeamName = "";
			teamModal?.close();
		}
	}

	async function openMatchModal() {
		const { data, error } = await supabase.from("teams").select("*");
		if (!error) {
			allTeams = data;
			matchModal.showModal();
		}
	}

	async function createMatch() {
		const { error } = await supabase.from("matches").insert({
			title: matchTitle,
			team_1: team1,
			team_2: team2,
			home_score: homeScore,
			away_score: awayScore,
			duration,
			is_votable: isVotable,
			match_time: matchTime
		});

		if (error) {
			alert("Maç eklenemedi: " + error.message);
		} else {
			matchTitle = "";
			team1 = "";
			team2 = "";
			homeScore = 0;
			awayScore = 0;
			duration = "";
			isVotable = false;
			matchModal?.close();
		}
	}

	async function openEditMatchModal() {
		const { data, error } = await supabase.from("matches").select("*");
		if (!error) {
			allMatches = data;
			editMatchModal.showModal();
		}
	}

	function selectMatch(match) {
		selectedMatchId = match.id;
		editMatchTitle = match.title;
		editTeam1 = match.team_1;
		editTeam2 = match.team_2;
		editHomeScore = match.home_score;
		editAwayScore = match.away_score;
		editDuration = match.duration;
		editIsVotable = match.is_votable;
		editMatchTime = match.match_time;
	}

	async function updateMatch() {
		if (!selectedMatchId) return;

		const { error } = await supabase
			.from("matches")
			.update({
				title: editMatchTitle,
				team_1: editTeam1,
				team_2: editTeam2,
				home_score: editHomeScore,
				away_score: editAwayScore,
				duration: editDuration,
				is_votable: editIsVotable,
				match_time: editMatchTime
			})
			.eq("id", selectedMatchId);

		if (error) {
			alert("Maç güncellenemedi: " + error.message);
		} else {
			editMatchModal.close();
		}
	}

	async function openEditTeamModal() {
		const { data, error } = await supabase.from("teams").select("*");
		if (!error) {
			allTeams = data;
			editTeamModal.showModal();
		}
	}

	async function selectTeam(team) {
		selectedTeamId = team.id;
		editTeamName = team.name;

		const { data: lineup } = await supabase
			.from("lineups")
			.select("id, player_id, players(name), goals")
			.eq("team_id", team.id);

		const { data: players } = await supabase.from("players").select("id, name");

		teamLineup = lineup ?? [];
		allPlayersForLineup = players ?? [];
	}

	async function updateTeam() {
		if (!selectedTeamId) return;

		const { error } = await supabase
			.from("teams")
			.update({
				name: editTeamName
			})
			.eq("id", selectedTeamId);

		if (error) {
			alert("Takım güncellenemedi: " + error.message);
		} else {
			editTeamModal.close();
		}
	}

	async function removePlayerFromLineup(lineupId: number) {
		await supabase.from("lineups").delete().eq("id", lineupId);
		teamLineup = teamLineup.filter((p) => p.id !== lineupId);
	}

	async function addPlayerToLineup() {
		if (!selectedTeamId || !selectedPlayerForLineup) return;

		const { data, error } = await supabase
			.from("lineups")
			.insert({
				team_id: selectedTeamId,
				player_id: selectedPlayerForLineup
			})
			.select("id, player_id, players(name)")
			.single();

		if (!error && data) {
			teamLineup = [...teamLineup, data];
			selectedPlayerForLineup = "";
		}
	}

	async function updateGoalCount(lineupId: number, newGoals: number) {
		const { error } = await supabase.from("lineups").update({ goals: newGoals }).eq("id", lineupId);

		if (error) {
			alert("Gol sayısı güncellenemedi: " + error.message);
		}
	}
</script>

<main class="flex min-h-screen flex-col items-center gap-5">
	<section class="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
		<button class="btn btn-primary w-full" on:click={() => playerModal.showModal()}
			>Oyuncu Ekle</button
		>
		<button class="btn btn-secondary w-full" on:click={openEditPlayerModal}>Oyuncu Düzenle</button>

		<button class="btn btn-primary w-full" on:click={() => teamModal.showModal()}>Takım Ekle</button
		>
		<button class="btn btn-secondary w-full" on:click={openEditTeamModal}>Takım Düzenle</button>

		<button class="btn btn-primary col-span-1 w-full" on:click={openMatchModal}>Maç Ekle</button>
		<button class="btn btn-secondary col-span-1 w-full" on:click={openEditMatchModal}
			>Maç Düzenle</button
		>
	</section>

	<button on:click={handleLogout} class="btn btn-outline btn-block btn-error mt-4 max-w-md"
		>Çıkış Yap</button
	>

	<dialog bind:this={playerModal} class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Yeni Oyuncu Ekle</h3>
			<input
				bind:value={newPlayerId}
				type="text"
				placeholder="Oyuncu ID"
				class="input input-bordered my-2 w-full"
			/>
			<input
				bind:value={newPlayerName}
				type="text"
				placeholder="Oyuncu Adı"
				class="input input-bordered my-2 w-full"
			/>
			<input
				bind:value={newPlayerNumber}
				type="number"
				placeholder="Forma Numarası"
				class="input input-bordered my-2 w-full"
			/>
			<div class="modal-action">
				<button on:click={() => playerModal.close()} class="btn">Vazgeç</button>
				<button on:click={createPlayer} class="btn btn-primary">Ekle</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	<dialog bind:this={teamModal} class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Yeni Takım Ekle</h3>
			<input
				bind:value={newTeamName}
				type="text"
				placeholder="Takım Adı"
				class="input input-bordered my-2 w-full"
			/>
			<div class="modal-action">
				<button on:click={() => teamModal.close()} class="btn">Vazgeç</button>
				<button on:click={createTeam} class="btn btn-primary">Ekle</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	<dialog bind:this={matchModal} class="modal">
		<div class="modal-box relative">
			<h3 class="text-lg font-bold">Yeni Maç Ekle</h3>
			<input
				bind:value={matchTitle}
				type="text"
				placeholder="Maç Başlığı"
				class="input input-bordered my-2 w-full"
			/>
			<label class="label-text">Takım 1</label>
			<select bind:value={team1} class="select select-bordered my-2 w-full">
				<option disabled selected value="">Takım Seçin</option>
				{#each allTeams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>

			<label class="label-text">Takım 2</label>
			<select bind:value={team2} class="select select-bordered my-2 w-full">
				<option disabled selected value="">Takım Seçin</option>
				{#each allTeams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>
			<input
				bind:value={homeScore}
				type="number"
				placeholder="Ev Skoru"
				class="input input-bordered my-2 w-full"
			/>
			<input
				bind:value={awayScore}
				type="number"
				placeholder="Deplasman Skoru"
				class="input input-bordered my-2 w-full"
			/>
			<input
				bind:value={duration}
				type="text"
				placeholder="Süre (ör. 90dk)"
				class="input input-bordered my-2 w-full"
			/>
			<input
				bind:value={matchTime}
				type="datetime-local"
				placeholder="Maç Başlangıç Saati"
				class="input input-bordered my-2 w-full"
			/>
			<label class="label cursor-pointer">
				<span class="label-text">Oylamaya Açık mı?</span>
				<input type="checkbox" bind:checked={isVotable} class="checkbox" />
			</label>
			<div class="modal-action">
				<button on:click={() => matchModal.close()} class="btn">Vazgeç</button>
				<button on:click={createMatch} class="btn btn-primary">Ekle</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	<dialog bind:this={editMatchModal} class="modal">
		<div class="modal-box max-w-xl">
			<h3 class="mb-2 text-lg font-bold">Bir Maç Seçin</h3>
			<div class="mb-4">
				{#each allMatches as match}
					<button class="btn btn-sm btn-outline mb-1 w-full" on:click={() => selectMatch(match)}>
						{match.title}
					</button>
				{/each}
			</div>
			{#if selectedMatchId}
				<label class="label-text">Maç Başlığı</label>
				<input
					bind:value={editMatchTitle}
					type="text"
					placeholder="Maç Başlığı"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label-text">Takım 1</label>
				<select bind:value={editTeam1} class="select select-bordered my-2 w-full">
					<option disabled selected value="">Takım Seçin</option>
					{#each allTeams as team}
						<option value={team.id}>{team.name}</option>
					{/each}
				</select>
				<label class="label-text">Takım 2</label>
				<select bind:value={editTeam2} class="select select-bordered my-2 w-full">
					<option disabled selected value="">Takım Seçin</option>
					{#each allTeams as team}
						<option value={team.id}>{team.name}</option>
					{/each}
				</select>
				<label class="label-text">Ev Skoru</label>
				<input
					bind:value={editHomeScore}
					type="number"
					placeholder="Ev Skoru"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label-text">Deplasman Skoru</label>
				<input
					bind:value={editAwayScore}
					type="number"
					placeholder="Deplasman Skoru"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label-text">Süre</label>
				<input
					bind:value={editDuration}
					type="text"
					placeholder="Süre"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label-text">Maç Saati</label>
				<input
					bind:value={editMatchTime}
					type="datetime-local"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label cursor-pointer">
					<span class="label-text">Oylamaya Açık mı?</span>
					<input type="checkbox" bind:checked={editIsVotable} class="checkbox" />
				</label>
				<div class="modal-action">
					<button on:click={() => editMatchModal.close()} class="btn">Vazgeç</button>
					<button on:click={updateMatch} class="btn btn-primary">Güncelle</button>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop"><button>close</button></form>
	</dialog>

	<dialog bind:this={editTeamModal} class="modal">
		<div class="modal-box max-w-xl">
			<h3 class="mb-2 text-lg font-bold">Bir Takım Seçin</h3>
			<div class="mb-4">
				{#each allTeams as team}
					<button class="btn btn-sm btn-outline mb-1 w-full" on:click={() => selectTeam(team)}>
						{team.name}
					</button>
				{/each}
			</div>
			{#if selectedTeamId}
				<label class="label-text">Takım Adı</label>
				<input
					bind:value={editTeamName}
					type="text"
					placeholder="Takım Adı"
					class="input input-bordered my-2 w-full"
				/>

				<label class="label-text mt-4">Mevcut Kadro</label>
				<ul class="space-y-1">
					{#each teamLineup as row}
						<li class="flex items-center justify-between rounded border p-2">
							<span>{row.players?.name}</span>
							<div class="flex items-center gap-2">
								<input
									type="number"
									min="0"
									class="input input-bordered input-xs w-16"
									value={row.goals}
									on:change={(e) => updateGoalCount(row.id, +e.target.value)}
								/>
								<button class="btn btn-xs btn-error" on:click={() => removePlayerFromLineup(row.id)}
									>Sil</button
								>
							</div>
						</li>
					{/each}
				</ul>

				<div class="mt-4">
					<label class="label-text">Oyuncu Ekle</label>
					<div class="flex gap-2">
						<select bind:value={selectedPlayerForLineup} class="select select-bordered w-full">
							<option disabled value="">Oyuncu seç</option>
							{#each allPlayersForLineup as p}
								<option value={p.id}>{p.name}</option>
							{/each}
						</select>
						<button class="btn btn-primary" on:click={addPlayerToLineup}>Ekle</button>
					</div>
				</div>

				<div class="modal-action">
					<button on:click={() => editTeamModal.close()} class="btn">Vazgeç</button>
					<button on:click={updateTeam} class="btn btn-primary">Güncelle</button>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>

	<dialog bind:this={editPlayerModal} class="modal">
		<div class="modal-box max-w-xl">
			<h3 class="mb-2 text-lg font-bold">Bir Oyuncu Seçin</h3>
			<div class="mb-4">
				{#each allPlayers as player}
					<button class="btn btn-sm btn-outline mb-1 w-full" on:click={() => selectPlayer(player)}>
						{player.name}
					</button>
				{/each}
			</div>
			{#if selectedPlayerId}
				<label class="label-text">Oyuncu Adı</label>
				<input
					bind:value={editPlayerName}
					type="text"
					placeholder="Oyuncu Adı"
					class="input input-bordered my-2 w-full"
				/>
				<label class="label-text">Forma Numarası</label>
				<input
					bind:value={editPlayerNumber}
					type="number"
					placeholder="Forma No"
					class="input input-bordered my-2 w-full"
				/>
				<div class="modal-action">
					<button on:click={() => editPlayerModal.close()} class="btn">Vazgeç</button>
					<button on:click={updatePlayer} class="btn btn-primary">Güncelle</button>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</main>
