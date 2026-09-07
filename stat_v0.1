/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");


    // ==========================================
    // DRACULA PALETTE
    // ==========================================

    const RESET =
        "\x1b[0m";

    const RED =
        "\x1b[38;2;255;85;85m";

    const ORANGE =
        "\x1b[38;2;255;184;108m";

    const YELLOW =
        "\x1b[38;2;241;250;140m";

    const GREEN =
        "\x1b[38;2;80;250;123m";

    const CYAN =
        "\x1b[38;2;139;233;253m";

    const PURPLE =
        "\x1b[38;2;189;147;249m";

    const PINK =
        "\x1b[38;2;255;121;198m";

    const WHITE =
        "\x1b[38;2;248;248;242m";

    const COMMENT =
        "\x1b[38;2;98;114;164m";


    // ==========================================
    // TARGET
    // ==========================================

    const target =
        ns.args[0] ||
        "n00dles";


    // ==========================================
    // TAIL
    // ==========================================

    ns.ui.openTail();

    ns.ui.resizeTail(
        560,
        700
    );

    // 1080p top-right
    ns.ui.moveTail(
        520,
        0
    );


    // ==========================================
    // STATE
    // ==========================================

    let previousMoney =
        ns.getPlayer().money;


    // ==========================================
    // MAIN LOOP
    // ==========================================

    while (true) {

        ns.clearLog();


        // ======================================
        // PLAYER
        // ======================================

        const player =
            ns.getPlayer();

        const money =
            player.money;

        const moneyChange =
            money -
            previousMoney;


        let moneyArrow =
            "";

        let moneyColor =
            WHITE;


        if (
            moneyChange > 0
        ) {

            moneyArrow =
                "▲";

            moneyColor =
                GREEN;

        } else if (
            moneyChange < 0
        ) {

            moneyArrow =
                "▼";

            moneyColor =
                RED;
        }


        // ======================================
        // NETWORK
        // ======================================

        const servers =
            scanNetwork(
                ns
            );


        let rooted =
            0;

        let totalRam =
            0;

        let usedRam =
            0;


        for (
            const server of servers
        ) {

            if (
                ns.hasRootAccess(
                    server
                )
            ) {

                rooted++;

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
                totalRam -
                usedRam
            );


        const utilization =
            totalRam > 0
                ? usedRam / totalRam
                : 0;


        // ======================================
        // MAINHACK DEPLOYMENT
        // ======================================

        let deploymentServers =
            0;

        let deploymentProcesses =
            0;

        let deploymentThreads =
            0;

        let workerRam =
            0;

        const mainHackRam =
            ns.getScriptRam(
                "mainHack.js"
            );


        const targets =
            new Set();


        for (
            const server of servers
        ) {

            if (
                !ns.hasRootAccess(
                    server
                )
            ) {
                continue;
            }


            const processes =
                ns.ps(
                    server
                );


            for (
                const process of processes
            ) {

                if (
                    process.filename !==
                    "mainHack.js"
                ) {
                    continue;
                }


                deploymentProcesses++;

                deploymentThreads +=
                    process.threads;

                workerRam +=
                    mainHackRam *
                    process.threads;


                if (
                    process.args.length > 0
                ) {

                    targets.add(
                        String(
                            process.args[0]
                        )
                    );
                }
            }
        }


        deploymentServers =
            new Set(
                servers.filter(
                    server =>
                        ns.ps(server).some(
                            process =>
                                process.filename ===
                                "mainHack.js"
                        )
                )
            ).size;


        // ======================================
        // ACTION
        // ======================================

        const security =
            ns.getServerSecurityLevel(
                target
            );

        const minimumSecurity =
            ns.getServerMinSecurityLevel(
                target
            );

        const securityDifference =
            security -
            minimumSecurity;


        const targetMoney =
            ns.getServerMoneyAvailable(
                target
            );

        const targetMaxMoney =
            ns.getServerMaxMoney(
                target
            );

        const moneyPercent =
            targetMaxMoney > 0
                ? targetMoney /
                  targetMaxMoney
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


        // ======================================
        // HACKNET
        // ======================================

        const nodes =
            ns.hacknet.numNodes();


        let hacknetProduction =
            0;

        let totalLevel =
            0;

        let totalHacknetRam =
            0;

        let totalCores =
            0;


        for (
            let i = 0;
            i < nodes;
            i++
        ) {

            const node =
                ns.hacknet.getNodeStats(
                    i
                );


            hacknetProduction +=
                node.production;

            totalLevel +=
                node.level;

            totalHacknetRam +=
                node.ram;

            totalCores +=
                node.cores;
        }


        // ======================================
        // HACKNET INVESTMENT
        // ======================================

        const investmentFile =
            "hacknet-investment.txt";


        let totalInvestment =
            Number(
                ns.read(
                    investmentFile
                )
            );


        if (
            !Number.isFinite(
                totalInvestment
            )
        ) {

            totalInvestment =
                0;
        }


        const reserve =
            Math.max(
                50000,
                money * 0.5
            );


        const hacknetAvailable =
            Math.max(
                0,
                money - reserve
            );


        const nextNodeCost =
            nodes < 25
                ? ns.hacknet.getPurchaseNodeCost()
                : 0;


        const nextUpgrade =
            findCheapestUpgrade(
                ns,
                hacknetAvailable
            );


        // ======================================
        // TARGET TIMERS
        // ======================================

        const hackTime =
            ns.getHackTime(
                target
            );

        const growTime =
            ns.getGrowTime(
                target
            );

        const weakenTime =
            ns.getWeakenTime(
                target
            );


        // ======================================
        // REFRESH DISPLAY
        // ======================================

        ns.print(
            `${PURPLE}═══════════[ ◈ PLAYER STATS HUD ◈]═══════════${RESET}`
        );

        ns.print(
            `${YELLOW}Avail Balance :${RESET} ` +
            `${WHITE}$${ns.format.number(
                money,
                2
            )}${RESET} ` +
            `${moneyArrow} ` +
            `${moneyColor}${moneyChange >= 0 ? "+" : ""}` +
            `$${ns.format.number(
                Math.abs(moneyChange),
                2
            )}${RESET} `)
     
        ns.print(
            `${YELLOW}Hacking Level :${RESET} ` +    
            `${WHITE}${player.skills.hacking}${RESET}`
        );

        ns.print(
            `${YELLOW}Strength      :${RESET} ${WHITE}${player.skills.strength}${RESET}` +
            `             ${YELLOW}Defense       :${RESET} ${WHITE}${player.skills.defense}${RESET}`
        );

        ns.print(
            `${YELLOW}Dexterity     :${RESET} ${WHITE}${player.skills.dexterity}${RESET}` +
            `             ${YELLOW}Agility       :${RESET} ${WHITE}${player.skills.agility}${RESET}`
        );

        ns.print(
            `${YELLOW}Current City  :${RESET} ${WHITE}${player.city}${RESET}`
        );


        // ======================================
        // NETWORK
        // ======================================

        ns.print(
            `${PURPLE}    ════════════[ ◈ NETWORK ◈]════════════════${RESET}`
        );

        ns.print(
            `${YELLOW}Discovered    :${RESET} ${WHITE}${servers.length}${RESET}` +
            `             ${YELLOW}Rooted        :${RESET} ${GREEN}${rooted}${RESET}`
        );

        ns.print(
            `${YELLOW}RAM Capacity  :${RESET} ${WHITE}${ns.format.number(totalRam, 2)}GB${RESET}` +
            `       ${YELLOW}RAM Used      :${RESET} ${WHITE}${ns.format.number(usedRam, 2)}GB${RESET}`
        );

        ns.print(
            `${YELLOW}RAM Available :${RESET} ${GREEN}${ns.format.number(availableRam, 2)}GB${RESET}` +
            `        ${YELLOW}Utilization   :${RESET} ${WHITE}${ns.format.percent(utilization, 1)}${RESET}`
        );


        // ======================================
        // MAINHACK
        // ======================================

        ns.print(
            `${PURPLE}    ══════════[ ◈ MAINHACK DEPLOYMENT ◈]════════${RESET}`
        );

        ns.print(
            `${YELLOW}Servers       :${RESET} ${WHITE}${deploymentServers}${RESET}` +
            `             ${YELLOW}Processes     :${RESET} ${WHITE}${deploymentProcesses}${RESET}`
        );

        ns.print(
            `${YELLOW}Threads       :${RESET} ${WHITE}${deploymentThreads}${RESET}` +
            `             ${YELLOW}Worker RAM    :${RESET} ${WHITE}${ns.format.number(workerRam, 2)}GB${RESET}`
        );

        ns.print(
            `${YELLOW}Unique Targets:${RESET} ${WHITE}${targets.size}${RESET}` +
            `              ${YELLOW}Target        :${RESET} ${WHITE}${target}${RESET}`
        );

        ns.print(
            `${YELLOW}Action        :${RESET} ${actionColor}${action}${RESET}`
        );


        // ======================================
        // HACKNET
        // ======================================

        ns.print(
            `${PURPLE}    ══════════════[ ◈ HACKNET ◈]════════════════${RESET}`
        );

        ns.print(
            `${YELLOW}Nodes         :${RESET} ${WHITE}${nodes} / 25${RESET}` +
            `         ${YELLOW}Production    :${RESET} ${GREEN}$${ns.format.number(hacknetProduction, 2)}/s${RESET}`
        );

        ns.print(
            `${YELLOW}Total Level   :${RESET} ${WHITE}${totalLevel}${RESET}` +
            `           ${YELLOW}Total RAM     :${RESET} ${WHITE}${ns.format.number(totalHacknetRam, 2)}GB${RESET}`
        );

        ns.print(
            `${YELLOW}Total Cores   :${RESET} ${WHITE}${totalCores}${RESET}` +
            `             ${YELLOW}Total Invested:${RESET}${WHITE}$${ns.format.number(totalInvestment, 2)}${RESET}`
        );

        ns.print(
            `${YELLOW}Next Node     :${RESET} ${WHITE}$${ns.format.number(nextNodeCost, 2)}${RESET}` +
            `       ${YELLOW}Best Upgrade  :${RESET} ${WHITE}${nextUpgrade.name}${RESET}`
        );

        ns.print(
            `${YELLOW}Upgrade Cost  :${RESET} ${WHITE}$${ns.format.number(nextUpgrade.cost, 2)}${RESET}` +
            `        ${YELLOW}Payback       :${RESET} ${WHITE}${formatTime(nextUpgrade.payback)}${RESET}`
        );


        // ======================================
        // TARGET SERVER
        // ======================================

        ns.print(
            `${PURPLE}    ════════════[ ◈ TARGET SERVER ◈]════════════${RESET}`
        );

        const targetServer =
            ns.getServer(
                target
            );


        ns.print(
            `${YELLOW}Target        :${RESET} ${WHITE}${target}${RESET}` +
            `     ${YELLOW}Root Access   :${RESET} ` +
            `${targetServer.hasAdminRights ? GREEN : RED}${targetServer.hasAdminRights}${RESET}`
        );

        ns.print(
            `${YELLOW}Avail Balance :${RESET} ${WHITE}$${ns.format.number(targetMoney, 2)}${RESET}` +
            `         ${YELLOW}Max Balance   :${RESET} ${WHITE}$${ns.format.number(targetMaxMoney, 2)}${RESET}`
        );

        ns.print(
            `${YELLOW}Money Percent :${RESET} ${WHITE}${ns.format.percent(moneyPercent, 2)}${RESET}` +
            `          ${YELLOW}Growth        :${RESET} ${WHITE}${targetServer.serverGrowth}${RESET}`
        );


        // ======================================
        // SECURITY
        // ======================================

        ns.print(
            `${PURPLE}    ═══════════════[◈ SECURITY ◈]═══════════════${RESET}`
        );

        ns.print(
            `${YELLOW}Current Level :${RESET} ${WHITE}${ns.format.number(security, 2)}${RESET}` +
            `           ${YELLOW}Minimum Level :${RESET} ${WHITE}${ns.format.number(minimumSecurity, 2)}${RESET}`
        );

        ns.print(
            `${YELLOW}Difference    :${RESET} ${securityDifference > 0 ? RED : GREEN}` +
            `${securityDifference >= 0 ? "+" : ""}${ns.format.number(securityDifference, 2)}${RESET}` +
            `          ${YELLOW}Ports         :${RESET} ${WHITE}${targetServer.openPortCount}/${targetServer.numOpenPortsRequired}${RESET}`
        );


        // ======================================
        // RAM
        // ======================================

        ns.print(
            `${PURPLE}    ════════════════[◈ RAM ◈]══════════════════${RESET}`
        );

        ns.print(
            `${YELLOW}Used          :${RESET} ${WHITE}${ns.format.number(targetServer.ramUsed, 2)}GB${RESET}` +
            `        ${YELLOW}Free          :${RESET} ${WHITE}${ns.format.number(Math.max(0, targetServer.maxRam - targetServer.ramUsed), 2)}GB${RESET}`
        );

        ns.print(
            `${YELLOW}Max           :${RESET} ${WHITE}${ns.format.number(targetServer.maxRam, 2)}GB${RESET}` +
            `        ${YELLOW}Hack Level    :${RESET} ${WHITE}${targetServer.requiredHackingSkill}${RESET}`
        );


        // ======================================
        // TIMERS
        // ======================================

        ns.print(
            `${PURPLE}    ════════════════[◈ TIMERS ◈]════════════════${RESET}`
        );

        ns.print(
            `${YELLOW}Hack          :${RESET} ${WHITE}${formatTimeMs(hackTime)}${RESET}` +
            `          ${YELLOW}Grow          :${RESET} ${WHITE}${formatTimeMs(growTime)}${RESET}`
        );

        ns.print(
            `${YELLOW}Weaken        :${RESET} ${WHITE}${formatTimeMs(weakenTime)}${RESET}`
        );


        // ======================================
        // UPDATE MONEY BASELINE
        // ======================================

        previousMoney =
            money;


        await ns.sleep(
            1000
        );
    }
}


// ==========================================================
// NETWORK SCAN
// ==========================================================

function scanNetwork(ns) {

    const network =
        [];

    const visited =
        new Set();


    function scan(server) {

        if (
            visited.has(server)
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
// CHEAPEST HACKNET UPGRADE
// ==========================================================

function findCheapestUpgrade(
    ns,
    available
) {

    const candidates =
        [];


    const nodes =
        ns.hacknet.numNodes();


    if (
        nodes < 25
    ) {

        const cost =
            ns.hacknet.getPurchaseNodeCost();


        if (
            Number.isFinite(cost) &&
            cost > 0 &&
            cost <= available
        ) {

            candidates.push({
                name: `NEW NODE #${nodes}`,
                cost,
                payback: 0
            });
        }
    }


    for (
        let i = 0;
        i < nodes;
        i++
    ) {

        const levelCost =
            ns.hacknet.getLevelUpgradeCost(
                i,
                1
            );

        if (
            Number.isFinite(levelCost) &&
            levelCost > 0 &&
            levelCost <= available
        ) {

            candidates.push({
                name: `LEVEL #${i}`,
                cost: levelCost,
                payback: 0
            });
        }


        const ramCost =
            ns.hacknet.getRamUpgradeCost(
                i,
                1
            );

        if (
            Number.isFinite(ramCost) &&
            ramCost > 0 &&
            ramCost <= available
        ) {

            candidates.push({
                name: `RAM #${i}`,
                cost: ramCost,
                payback: 0
            });
        }


        const coreCost =
            ns.hacknet.getCoreUpgradeCost(
                i,
                1
            );

        if (
            Number.isFinite(coreCost) &&
            coreCost > 0 &&
            coreCost <= available
        ) {

            candidates.push({
                name: `CORE #${i}`,
                cost: coreCost,
                payback: 0
            });
        }
    }


    if (
        candidates.length === 0
    ) {

        return {
            name: "NONE",
            cost: 0,
            payback: 0
        };
    }


    candidates.sort(
        (a, b) =>
            a.cost -
            b.cost
    );


    return candidates[0];
}


// ==========================================================
// TIME
// ==========================================================

function formatTimeMs(
    milliseconds
) {

    const seconds =
        milliseconds /
        1000;


    return formatTime(
        seconds
    );
}


function formatTime(
    seconds
) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "N/A";
    }


    if (
        seconds < 60
    ) {

        return `${seconds.toFixed(1)}s`;
    }


    const minutes =
        Math.floor(
            seconds /
            60
        );

    const remainingSeconds =
        Math.floor(
            seconds %
            60
        );


    if (
        minutes < 60
    ) {

        return (
            `${minutes}m ` +
            `${remainingSeconds}s`
        );
    }


    const hours =
        Math.floor(
            minutes /
            60
        );

    const remainingMinutes =
        minutes %
        60;


    return (
        `${hours}h ` +
        `${remainingMinutes}m`
    );
}
