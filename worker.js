//worker.js
//DiamondSkyline

/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");

    // ==========================================
    // DRACULA PALETTE
    // ==========================================

    const RESET   = "\x1b[0m";

    const RED     = "\x1b[38;2;255;85;85m";
    const ORANGE  = "\x1b[38;2;255;184;108m";
    const YELLOW  = "\x1b[38;2;241;250;140m";
    const GREEN   = "\x1b[38;2;80;250;123m";
    const CYAN    = "\x1b[38;2;139;233;253m";
    const PURPLE  = "\x1b[38;2;189;147;249m";
    const PINK    = "\x1b[38;2;255;121;198m";
    const WHITE   = "\x1b[38;2;248;248;242m";
    const COMMENT = "\x1b[38;2;98;114;164m";


    // ==========================================
    // CONFIGURATION
    // ==========================================

    const TARGET =
        ns.args[0];

    const MAIN_HACK =
        "mainHack.js";


    if (!TARGET) {

        ns.tprint(
            `${RED}ERROR:${RESET} No target supplied.`
        );

        ns.tprint(
            `Usage: run worker.js <target>`
        );

        return;
    }


    // ==========================================
    // OPEN TAIL
    // ==========================================

    ns.ui.openTail();

    ns.ui.resizeTail(
        490,
        225
    );

    ns.ui.moveTail(
        0,
        0
    );


    // ==========================================
    // ROOT PROGRAMS
    // ==========================================

    const programs = [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "relaySMTP.exe",
        "HTTPWorm.exe",
        "SQLInject.exe"
    ];


    // ==========================================
    // STATE
    // ==========================================

    let lastRootCount = 0;
    let lastDeployCount = 0;


    // ==========================================
    // MAIN SPIDER LOOP
    // ==========================================

    while (true) {

        // --------------------------------------
        // BUILD NETWORK
        // --------------------------------------

        const servers =
            scanNetwork(
                ns
            );


        // --------------------------------------
        // ROOT EVERYTHING POSSIBLE
        // --------------------------------------

        for (const server of servers) {

            if (
                server === "home"
            ) {
                continue;
            }


            const rooted =
                ns.hasRootAccess(
                    server
                );


            if (!rooted) {

                rootServer(
                    ns,
                    server,
                    programs
                );
            }
        }


        // --------------------------------------
        // DEPLOY MAINHACK
        // --------------------------------------

        let deployedServers = 0;


        for (const server of servers) {

            if (
                !ns.hasRootAccess(
                    server
                )
            ) {
                continue;
            }


            // ----------------------------------
            // HOME
            // ----------------------------------

            if (
                server === "home"
            ) {

                if (
                    ns.fileExists(
                        MAIN_HACK,
                        "home"
                    )
                ) {

                    deployToServer(
                        ns,
                        "home",
                        TARGET,
                        MAIN_HACK
                    );

                    deployedServers++;
                }

                continue;
            }


            // ----------------------------------
            // COPY SCRIPT
            // ----------------------------------

            ns.scp(
                MAIN_HACK,
                server,
                "home"
            );


            // ----------------------------------
            // DEPLOY
            // ----------------------------------

            deployToServer(
                ns,
                server,
                TARGET,
                MAIN_HACK
            );


            deployedServers++;
        }


        // --------------------------------------
        // NETWORK DATA
        // --------------------------------------

        let rootedCount = 0;
        let totalRam = 0;
        let usedRam = 0;


        for (const server of servers) {

            if (
                ns.hasRootAccess(
                    server
                )
            ) {

                rootedCount++;

                totalRam +=
                    ns.getServerMaxRam(
                        server
                    );

                usedRam +=
                    ns.getServerUsedRam(
                        server
                    );
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


        // --------------------------------------
        // TARGET ACTION
        // --------------------------------------

        const security =
            ns.getServerSecurityLevel(
                TARGET
            );

        const minimumSecurity =
            ns.getServerMinSecurityLevel(
                TARGET
            );

        const securityDifference =
            security -
            minimumSecurity;


        const money =
            ns.getServerMoneyAvailable(
                TARGET
            );

        const maximumMoney =
            ns.getServerMaxMoney(
                TARGET
            );

        const moneyPercent =
            maximumMoney > 0
                ? money / maximumMoney
                : 0;


        let action =
            "HACK";

        let actionColor =
            CYAN;


        if (
            securityDifference > 0.5
        ) {

            action =
                "WEAKEN";

            actionColor =
                RED;

        } else if (
            moneyPercent < 0.75
        ) {

            action =
                "GROW";

            actionColor =
                GREEN;
        }


        // --------------------------------------
        // REFRESH DISPLAY
        // --------------------------------------

        ns.clearLog();


        ns.print(
            `${PURPLE}═══════════[ ◈ WORKER SPIDER ◈ ]═══════════${RESET}`
        );

        ns.print("");

        ns.print(
            `${YELLOW}Target        :${RESET} ` +
            `${WHITE}${TARGET}${RESET}`
        );

        ns.print(
            `${YELLOW}Action        :${RESET} ` +
            `${actionColor}${action}${RESET}`
        );

        ns.print(
            `${YELLOW}Discovered    :${RESET} ` +
            `${WHITE}${servers.length}${RESET}    ` +
            `${YELLOW}Rooted        :${RESET} ` +
            `${GREEN}${rootedCount}${RESET}`
        );

        ns.print(
            `${YELLOW}Deployed      :${RESET} ` +
            `${WHITE}${deployedServers}${RESET}`
        );

        ns.print("");

        ns.print(
            `${PURPLE}══════════════[ ◈ NETWORK ◈ ]══════════════${RESET}`
        );

        ns.print("");

        ns.print(
            `${YELLOW}RAM Capacity  :${RESET} ` +
            `${WHITE}${ns.format.number(
                totalRam,
                2
            )}GB${RESET}    ` +
            `${YELLOW}RAM Used      :${RESET} ` +
            `${WHITE}${ns.format.number(
                usedRam,
                2
            )}GB${RESET}`
        );

        ns.print(
            `${YELLOW}RAM Available :${RESET} ` +
            `${GREEN}${ns.format.number(
                availableRam,
                2
            )}GB${RESET}    ` +
            `${YELLOW}Utilization   :${RESET} ` +
            `${WHITE}${ns.format.percent(
                utilization,
                1
            )}${RESET}`
        );

        ns.print("");

        ns.print(
            `${COMMENT}Spider monitoring ${servers.length} servers...${RESET}`
        );


        lastRootCount =
            rootedCount;

        lastDeployCount =
            deployedServers;


        await ns.sleep(
            1000
        );
    }
}


// ==========================================================
// SCAN NETWORK
// ==========================================================

function scanNetwork(ns) {

    const network =
        [];

    const visited =
        new Set();


    function scan(server) {

        if (
            visited.has(
                server
            )
        ) {
            return;
        }


        visited.add(
            server
        );

        network.push(
            server
        );


        for (
            const next of ns.scan(server)
        ) {

            scan(next);
        }
    }


    scan(
        "home"
    );


    return network;
}


// ==========================================================
// ROOT SERVER
// ==========================================================

function rootServer(
    ns,
    server,
    programs
) {

    let portsOpened =
        0;


    if (
        ns.fileExists(
            "BruteSSH.exe",
            "home"
        )
    ) {

        ns.brutessh(
            server
        );

        portsOpened++;
    }


    if (
        ns.fileExists(
            "FTPCrack.exe",
            "home"
        )
    ) {

        ns.ftpcrack(
            server
        );

        portsOpened++;
    }


    if (
        ns.fileExists(
            "relaySMTP.exe",
            "home"
        )
    ) {

        ns.relaysmtp(
            server
        );

        portsOpened++;
    }


    if (
        ns.fileExists(
            "HTTPWorm.exe",
            "home"
        )
    ) {

        ns.httpworm(
            server
        );

        portsOpened++;
    }


    if (
        ns.fileExists(
            "SQLInject.exe",
            "home"
        )
    ) {

        ns.sqlinject(
            server
        );

        portsOpened++;
    }


    const requiredPorts =
        ns.getServerNumPortsRequired(
            server
        );


    if (
        portsOpened >= requiredPorts &&
        ns.getHackingLevel() >=
        ns.getServerRequiredHackingLevel(
            server
        )
    ) {

        ns.nuke(
            server
        );
    }
}


// ==========================================================
// DEPLOY MAINHACK
// ==========================================================

function deployToServer(
    ns,
    server,
    target,
    script
) {

    // ------------------------------------------
    // SCRIPT RAM
    // ------------------------------------------

    const scriptRam =
        ns.getScriptRam(
            script,
            server
        );


    if (
        scriptRam <= 0
    ) {
        return;
    }


    // ------------------------------------------
    // CHECK EXISTING PROCESSES
    // ------------------------------------------

    const processes =
        ns.ps(
            server
        );


    // ------------------------------------------
    // CHECK WHETHER ALREADY RUNNING
    // ------------------------------------------

    let running =
        false;


    for (
        const process of processes
    ) {

        if (
            process.filename === script &&
            process.args.length > 0 &&
            process.args[0] === target
        ) {

            running =
                true;

            break;
        }
    }


    if (running) {
        return;
    }


    // ------------------------------------------
    // AVAILABLE RAM
    // ------------------------------------------

    const maxRam =
        ns.getServerMaxRam(
            server
        );

    const usedRam =
        ns.getServerUsedRam(
            server
        );


    const availableRam =
        Math.max(
            0,
            maxRam - usedRam
        );


    const threads =
        Math.floor(
            availableRam /
            scriptRam
        );


    if (
        threads <= 0
    ) {
        return;
    }


    // ------------------------------------------
    // START MAINHACK
    // ------------------------------------------

    ns.exec(
        script,
        server,
        threads,
        target
    );
}
