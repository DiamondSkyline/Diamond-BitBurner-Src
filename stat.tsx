/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");

    // ============================================================
    // CONFIG
    // ============================================================

    const REFRESH = 1000;

    // Target supplied by command line
    const TARGET = ns.args[0];

    // ============================================================
    // COLORS
    // ============================================================

    const C = {
        bg: "#111217",
        panel: "#15171d",
        panel2: "#1b1d24",

        border: "#1b7a1b",

        text: "#b8b8ff",
        bright: "#d0d0ff",

        green: "#35e05a",
        red: "#ff5555",
        yellow: "#f1fa8c",

        cyan: "#8be9fd",
        purple: "#bd93f9",
        orange: "#ffb86c",

        gray: "#666677",
    };


    // ============================================================
    // WINDOW
    // ============================================================

    ns.ui.openTail();

    ns.ui.setTailTitle("STAT.TSX");


    // ============================================================
    // FORMATTERS
    // ============================================================

    function money(n) {

        if (!Number.isFinite(n))
            return "---";

        if (n >= 1e15)
            return "$" + (n / 1e15).toFixed(2) + "q";

        if (n >= 1e12)
            return "$" + (n / 1e12).toFixed(2) + "t";

        if (n >= 1e9)
            return "$" + (n / 1e9).toFixed(2) + "b";

        if (n >= 1e6)
            return "$" + (n / 1e6).toFixed(1) + "m";

        if (n >= 1e3)
            return "$" + (n / 1e3).toFixed(1) + "k";

        return "$" + n.toFixed(1);
    }


    function ram(n) {

        if (!Number.isFinite(n))
            return "---";

        if (n >= 1024)
            return (n / 1024).toFixed(1) + "TB";

        return n.toFixed(0) + "GB";
    }


    function pct(current, maximum) {

        if (maximum <= 0)
            return 0;

        return Math.min(
            100,
            Math.max(
                0,
                current / maximum * 100
            )
        );
    }


    function line(label, value, color) {

        return (
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    padding: "2px 0",
                }}
            >

                <span
                    style={{
                        width: "155px",
                        color: C.gray,
                    }}
                >
                    {label}
                </span>

                <span
                    style={{
                        color: color || C.text,
                        fontWeight: "bold",
                    }}
                >
                    {value}
                </span>

            </div>
        );
    }


    function section(title) {

        return (
            <div
                style={{
                    marginTop: "8px",
                    marginBottom: "3px",

                    paddingBottom: "2px",

                    borderBottom:
                        `1px solid ${C.border}`,

                    color: C.purple,

                    fontWeight: "bold",

                    fontSize: "14px",
                }}
            >
                {title}
            </div>
        );
    }


    // ============================================================
    // NETWORK DISCOVERY
    // ============================================================

    function getServers() {

        const found =
            new Set(["home"]);

        const queue =
            ["home"];

        while (queue.length > 0) {

            const current =
                queue.shift();

            for (
                const next of ns.scan(current)
            ) {

                if (!found.has(next)) {

                    found.add(next);

                    queue.push(next);
                }
            }
        }

        return [...found];
    }


    // ============================================================
    // RENDER
    // ============================================================

    function render() {

        // IMPORTANT:
        // Prevent the Bitburner tail from growing forever.

        ns.clearLog();


        // ========================================================
        // BASIC NETWORK DATA
        // ========================================================

        const servers =
            getServers();


        let rooted = 0;

        let totalRam = 0;

        let usedRam = 0;


        for (const server of servers) {

            if (
                ns.hasRootAccess(server)
            ) {

                rooted++;

                totalRam +=
                    ns.getServerMaxRam(server);

                usedRam +=
                    ns.getServerUsedRam(server);
            }
        }


        const availableRam =
            Math.max(
                0,
                totalRam - usedRam
            );


        const utilization =
            totalRam > 0
                ? usedRam / totalRam
                : 0;


        // ========================================================
        // PLAYER DATA
        // ========================================================

        const player =
            ns.getPlayer();

        const hackingLevel =
            ns.getHackingLevel();

        const hackingExp =
            player.exp.hacking;

        const homeMoney =
            ns.getServerMoneyAvailable("home");

        const strength =
            player.skills.strength;

        const defense =
            player.skills.defense;

        const dexterity =
            player.skills.dexterity;

        const agility =
            player.skills.agility;

        const charisma =
            player.skills.charisma;

        const intelligence =
            player.skills.intelligence;

        const factions =
            player.factions || [];

        const karma =
            typeof ns.heart === "object"
                ? ns.heart.break()
                : 0;


        // ========================================================
        // PLAYER JOB DATA
        // ========================================================

        let currentJob =
            "UNEMPLOYED";

        let jobCompany =
            "";

        try {

            const jobs =
                player.jobs || {};

            const companies =
                Object.keys(jobs);

            if (companies.length > 0) {

                jobCompany =
                    companies[companies.length - 1];

                currentJob =
                    jobs[jobCompany] ||
                    "EMPLOYEE";
            }

        } catch {

            currentJob =
                "UNEMPLOYED";
        }


        // ========================================================
        // TARGET DATA
        // ========================================================

        let targetExists = false;

        let targetRooted = false;

        let targetBackdoor = false;

        let targetHackLevel = 0;

        let targetChance = 0;

        let targetMoney = 0;

        let targetMaxMoney = 0;

        let targetGrowth = 0;

        let targetSecurity = 0;

        let targetMinSecurity = 0;

        let targetRam = 0;

        let targetRamMax = 0;

        let targetPorts = 0;

        let targetPortsRequired = 0;


        if (TARGET) {

            targetExists =
                servers.includes(TARGET);


            if (targetExists) {

                const s =
                    ns.getServer(TARGET);


                targetRooted =
                    s.hasAdminRights;

                targetBackdoor =
                    s.backdoorInstalled;

                targetHackLevel =
                    s.requiredHackingSkill;

                targetMoney =
                    ns.getServerMoneyAvailable(
                        TARGET
                    );

                targetMaxMoney =
                    ns.getServerMaxMoney(
                        TARGET
                    );

                targetGrowth =
                    ns.getServerGrowth(
                        TARGET
                    );

                targetSecurity =
                    ns.getServerSecurityLevel(
                        TARGET
                    );

                targetMinSecurity =
                    ns.getServerMinSecurityLevel(
                        TARGET
                    );

                targetRam =
                    ns.getServerUsedRam(
                        TARGET
                    );

                targetRamMax =
                    ns.getServerMaxRam(
                        TARGET
                    );

                targetPorts =
                    s.openPortCount;

                targetPortsRequired =
                    s.numOpenPortsRequired;


                try {

                    targetChance =
                        ns.hackAnalyzeChance(
                            TARGET
                        );

                } catch {

                    targetChance = 0;
                }
            }
        }


        // ========================================================
        // TARGET STATUS COLORS
        // ========================================================

        let targetColor =
            C.green;

        if (!TARGET) {

            targetColor =
                C.red;

        } else if (!targetExists) {

            targetColor =
                C.red;

        } else if (!targetRooted) {

            targetColor =
                C.yellow;
        }


        // ========================================================
        // SECURITY
        // ========================================================

        const securityDifference =
            targetSecurity -
            targetMinSecurity;


        let securityColor =
            C.green;


        if (securityDifference > 5) {

            securityColor =
                C.red;

        } else if (securityDifference > 1) {

            securityColor =
                C.yellow;
        }


        // ========================================================
        // MONEY
        // ========================================================

        const moneyPercent =
            pct(
                targetMoney,
                targetMaxMoney
            );


        let moneyColor =
            C.red;


        if (moneyPercent >= 90) {

            moneyColor =
                C.green;

        } else if (moneyPercent >= 50) {

            moneyColor =
                C.yellow;
        }


        // ========================================================
        // RAM
        // ========================================================

        const ramPercent =
            pct(
                targetRam,
                targetRamMax
            );


        // ========================================================
        // ROOTED NETWORK
        // ========================================================

        const rootedServers =
            servers.filter(
                server =>
                    ns.hasRootAccess(server)
            );


        let largestMoney =
            "---";

        let bestGrowth =
            "---";

        let largestMoneyValue =
            -1;

        let bestGrowthValue =
            -1;


        for (
            const server of rootedServers
        ) {

            // Never recommend n00dles.

            if (
                server === "n00dles"
            ) {
                continue;
            }


            const maxMoney =
                ns.getServerMaxMoney(
                    server
                );

            const growth =
                ns.getServerGrowth(
                    server
                );


            if (
                maxMoney >
                largestMoneyValue
            ) {

                largestMoneyValue =
                    maxMoney;

                largestMoney =
                    server;
            }


            if (
                growth >
                bestGrowthValue
            ) {

                bestGrowthValue =
                    growth;

                bestGrowth =
                    server;
            }
        }


        // ========================================================
        // PLAYER RECOMMENDATIONS
        // ========================================================

        let recommendedFaction =
            "NONE";

        let recommendedFactionRep =
            -1;


        // --------------------------------------------------------
        // FACTION
        // --------------------------------------------------------

        for (const faction of factions) {

            try {

                const rep = 0;
 /*                   ns.getFactionRep(
                        faction
                    );
*/
                if (
                    rep >
                    recommendedFactionRep
                ) {

                    recommendedFactionRep =
                        rep;

                    recommendedFaction =
                        faction;
                }

            } catch {
                // Ignore unavailable faction data.
            }
        }


        // --------------------------------------------------------
        // AUGMENTATION
        // --------------------------------------------------------

        let recommendedAugmentation =
            "NeuroFlux Governor";

        let augmentationFaction =
            recommendedFaction;


        /*
         * Try to find a useful augmentation from the player's
         * factions. If Singularity data is unavailable, safely
         * fall back to NeuroFlux Governor.
         */

        try {

            let bestAug =
                "";

            let bestFaction =
                "";

            for (
                const faction of factions
            ) {

                const augs = '';
                    /*ns.singularity
                        .getAugmentationsFromFaction(
                            faction
                        );
*/
                for (
                    const aug of augs
                ) {

                    if (
                        aug ===
                        "NeuroFlux Governor"
                    ) {
                        continue;
                    }

                    bestAug =
                        aug;

                    bestFaction =
                        faction;

                    break;
                }

                if (bestAug)
                    break;
            }

            if (bestAug) {

                recommendedAugmentation =
                    bestAug;

                augmentationFaction =
                    bestFaction;
            }

        } catch {

            // Keep fallback recommendation.
        }


        // --------------------------------------------------------
        // JOB RECOMMENDATION
        // --------------------------------------------------------

        let recommendedJob =
            "Software Engineering";


        if (
            hackingLevel >= 250
        ) {

            recommendedJob =
                "Security Engineer";

        } else if (
            hackingLevel >= 100
        ) {

            recommendedJob =
                "Security Guard";

        } else if (
            hackingLevel >= 50
        ) {

            recommendedJob =
                "IT Consultant";
        }


        // ========================================================
        // PLAYER / SPIDER DISPLAY
        // ========================================================

        ns.printRaw(

            <div
                style={{
                    width: "900px",

                    background: C.bg,

                    color: C.text,

                    fontFamily: "monospace",

                    fontSize: "13px",

                    padding: "10px",

                    boxSizing: "border-box",
                }}
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    style={{
                        display: "flex",

                        alignItems: "center",

                        borderBottom:
                            `1px solid ${C.border}`,

                        paddingBottom: "6px",
                    }}
                >

                    <div
                        style={{
                            flex: 1,

                            color: C.bright,

                            fontSize: "20px",

                            fontWeight: "bold",
                        }}
                    >
                        STAT.TSX
                    </div>

                    <div
                        style={{
                            color: C.green,

                            fontWeight: "bold",
                        }}
                    >
                        ● LIVE
                    </div>

                </div>


                {/* ================================================= */}
                {/* PLAYER */}
                {/* ================================================= */}

                {section("PLAYER")}


                <div
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >

                    <div style={{ flex: 1 }}>

                        {line(
                            "Hacking Level",
                            ns.format.number(
                                hackingLevel,
                                0
                            ),
                            C.cyan
                        )}

                        {line(
                            "Hacking EXP",
                            ns.format.number(
                                hackingExp,
                                0
                            ),
                            C.purple
                        )}

                        {line(
                            "Home Money",
                            money(homeMoney),
                            C.green
                        )}

                        {line(
                            "Karma",
                            karma.toFixed(2),
                            karma < 0
                                ? C.red
                                : C.text
                        )}

                    </div>


                    <div style={{ flex: 1 }}>

                        {line(
                            "Strength",
                            strength,
                            C.orange
                        )}

                        {line(
                            "Defense",
                            defense,
                            C.orange
                        )}

                        {line(
                            "Dexterity",
                            dexterity,
                            C.orange
                        )}

                        {line(
                            "Agility",
                            agility,
                            C.orange
                        )}

                    </div>


                    <div style={{ flex: 1 }}>

                        {line(
                            "Charisma",
                            charisma,
                            C.pink || C.purple
                        )}

                        {line(
                            "Intelligence",
                            intelligence,
                            C.cyan
                        )}

                        {line(
                            "Factions",
                            factions.length,
                            C.purple
                        )}

                        {line(
                            "Job",
                            currentJob,
                            C.yellow
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* SPIDER */}
                {/* ================================================= */}

                {section("WORKER SPIDER")}


                <div
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >

                    <div style={{ flex: 1 }}>

                        {line(
                            "Network RAM",
                            ram(totalRam),
                            C.cyan
                        )}

                        {line(
                            "RAM Used",
                            ram(usedRam),
                            C.yellow
                        )}

                    </div>


                    <div style={{ flex: 1 }}>

                        {line(
                            "RAM Available",
                            ram(availableRam),
                            C.green
                        )}

                        {line(
                            "Utilization",
                            ns.format.percent(
                                utilization,
                                1
                            ),
                            utilization >= 0.9
                                ? C.red
                                : C.text
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* TARGET */}
                {/* ================================================= */}

                {section("TRACKED TARGET")}


                {!TARGET && (

                    <div
                        style={{
                            color: C.red,
                            fontWeight: "bold",
                            padding: "4px 0",
                        }}
                    >
                        NO TARGET
                    </div>

                )}


                {TARGET && !targetExists && (

                    <div
                        style={{
                            color: C.red,
                            fontWeight: "bold",
                            padding: "4px 0",
                        }}
                    >
                        TARGET NOT FOUND: {TARGET}
                    </div>

                )}


                {TARGET && targetExists && (

                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                        }}
                    >

                        {/* ----------------------------------------- */}
                        {/* TARGET LEFT */}
                        {/* ----------------------------------------- */}

                        <div style={{ flex: 1 }}>

                            {line(
                                "Target",
                                TARGET,
                                targetColor
                            )}

                            {line(
                                "Root Access",
                                targetRooted
                                    ? "YES"
                                    : "NO",
                                targetRooted
                                    ? C.green
                                    : C.red
                            )}

                            {line(
                                "Backdoor",
                                targetBackdoor
                                    ? "INSTALLED"
                                    : "NO",
                                targetBackdoor
                                    ? C.green
                                    : C.yellow
                            )}

                            {line(
                                "Hack Chance",
                                Math.floor(
                                    targetChance * 100
                                ) + "%",
                                targetChance >= 0.8
                                    ? C.green
                                    : targetChance >= 0.4
                                        ? C.yellow
                                        : C.red
                            )}

                            {line(
                                "Required Level",
                                targetHackLevel,
                                hackingLevel >= targetHackLevel
                                    ? C.green
                                    : C.red
                            )}

                        </div>


                        {/* ----------------------------------------- */}
                        {/* TARGET RIGHT */}
                        {/* ----------------------------------------- */}

                        <div style={{ flex: 1 }}>

                            {line(
                                "Money",
                                money(targetMoney),
                                moneyColor
                            )}

                            {line(
                                "Max Money",
                                money(targetMaxMoney),
                                C.cyan
                            )}

                            {line(
                                "Money %",
                                Math.floor(
                                    moneyPercent
                                ) + "%",
                                moneyColor
                            )}

                            {line(
                                "Growth",
                                targetGrowth.toFixed(2) + "x",
                                C.orange
                            )}

                            {line(
                                "Security",
                                targetSecurity.toFixed(2) +
                                " / " +
                                targetMinSecurity.toFixed(2),
                                securityColor
                            )}

                        </div>


                        {/* ----------------------------------------- */}
                        {/* TARGET RESOURCE */}
                        {/* ----------------------------------------- */}

                        <div style={{ flex: 1 }}>

                            {line(
                                "RAM",
                                ram(targetRam) +
                                " / " +
                                ram(targetRamMax),
                                C.text
                            )}

                            {line(
                                "RAM Used",
                                Math.floor(
                                    ramPercent
                                ) + "%",
                                ramPercent >= 90
                                    ? C.red
                                    : C.text
                            )}

                            {line(
                                "Ports",
                                targetPorts +
                                " / " +
                                targetPortsRequired,
                                targetPorts >=
                                targetPortsRequired
                                    ? C.green
                                    : C.red
                            )}

                            {line(
                                "Security Above Min",
                                securityDifference.toFixed(2),
                                securityColor
                            )}

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* NETWORK HIGHLIGHTS */}
                {/* ================================================= */}

                {section("NETWORK HIGHLIGHTS")}


                <div
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >

                    <div style={{ flex: 1 }}>

                        {line(
                            "Largest Max Money",
                            largestMoney,
                            C.green
                        )}

                    </div>


                    <div style={{ flex: 1 }}>

                        {line(
                            "Best Growth",
                            bestGrowth,
                            C.orange
                        )}

                    </div>


                    <div style={{ flex: 1 }}>

                        {line(
                            "Tracked By Worker",
                            TARGET || "NONE",
                            TARGET
                                ? C.cyan
                                : C.gray
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* RECOMMENDATIONS */}
                {/* ================================================= */}

                {section("RECOMMENDATIONS")}


                <div
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >

                    {/* --------------------------------------------- */}
                    {/* FACTION */}
                    {/* --------------------------------------------- */}

                    <div style={{ flex: 1 }}>

                        {line(
                            "Faction",
                            recommendedFaction,
                            recommendedFaction !== "NONE"
                                ? C.purple
                                : C.gray
                        )}

                        {line(
                            "Faction Rep",
                            recommendedFactionRep >= 0
                                ? ns.format.number(
                                    recommendedFactionRep,
                                    0
                                )
                                : "---",
                            C.cyan
                        )}

                    </div>


                    {/* --------------------------------------------- */}
                    {/* JOB */}
                    {/* --------------------------------------------- */}

                    <div style={{ flex: 1 }}>

                        {line(
                            "Job",
                            recommendedJob,
                            C.yellow
                        )}

                        {line(
                            "Current",
                            jobCompany
                                ? jobCompany
                                : "UNEMPLOYED",
                            C.text
                        )}

                    </div>


                    {/* --------------------------------------------- */}
                    {/* AUGMENTATION */}
                    {/* --------------------------------------------- */}

                    <div style={{ flex: 1 }}>

                        {line(
                            "Augmentation",
                            recommendedAugmentation,
                            C.orange
                        )}

                        {line(
                            "Faction",
                            augmentationFaction || "---",
                            C.purple
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <div
                    style={{
                        marginTop: "8px",

                        paddingTop: "5px",

                        borderTop:
                            `1px solid ${C.border}`,

                        color: C.gray,
                    }}
                >
                    Worker Spider online
                    {"  |  "}
                    Monitoring {servers.length} servers
                    {"  |  "}
                    Target: {TARGET || "NONE"}
                </div>

            </div>
        );
    }


    // ============================================================
    // INITIAL RENDER
    // ============================================================

    render();


    // ============================================================
    // LIVE UPDATE
    // ============================================================

    while (true) {

        await ns.sleep(REFRESH);

        try {

            render();

        } catch (e) {

            ns.print(
                "STAT.TSX error: " +
                String(e)
            );

        }
    }
}
