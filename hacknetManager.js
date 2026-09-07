/** @param {NS} ns */
export async function main(ns) {

    // ==========================================================
    // HACKNET MANAGER
    // ==========================================================

    const CONFIG = {

        // ------------------------------------------------------
        // NODE LIMIT
        // ------------------------------------------------------

        maxNodes: 25,


        // ------------------------------------------------------
        // CASH RESERVE
        // ------------------------------------------------------

        // Keep 50% of current cash untouched.
        reservePercent: 0.5,

        // Absolute minimum reserve.
        reserveMinimum: 50000,


        // ------------------------------------------------------
        // PRODUCTION
        // ------------------------------------------------------

        minProductionGain: 0.000001,


        // ------------------------------------------------------
        // LOOP
        // ------------------------------------------------------

        loopMs: 100
    };


    // ==========================================================
    // INVESTMENT LEDGER
    // ==========================================================

    const investmentFile =
        "hacknet-investment.txt";

    let totalInvestment =
        loadInvestment(
            ns,
            investmentFile
        );


    // ==========================================================
    // LOG SETTINGS
    // ==========================================================

    ns.disableLog("ALL");


    // ==========================================================
    // STATE
    // ==========================================================

    let lastAction =
        "Waiting for investment...";


    // ==========================================================
    // MAIN LOOP
    // ==========================================================

    while (true) {

        // ------------------------------------------------------
        // CURRENT MONEY
        // ------------------------------------------------------

        const money =
            ns.getPlayer().money;


        // ------------------------------------------------------
        // CASH RESERVE
        // ------------------------------------------------------

        const reserve =
            Math.max(
                CONFIG.reserveMinimum,
                money * CONFIG.reservePercent
            );


        // ------------------------------------------------------
        // AVAILABLE HACKNET MONEY
        // ------------------------------------------------------

        const available =
            Math.max(
                0,
                money - reserve
            );


        // ------------------------------------------------------
        // FIND CHEAPEST INVESTMENT
        // ------------------------------------------------------

        const decision =
            findCheapestInvestment(
                ns,
                CONFIG,
                available
            );


        // ------------------------------------------------------
        // EXECUTE INVESTMENT
        // ------------------------------------------------------

        if (decision !== null) {

            const result =
                executeInvestment(
                    ns,
                    decision
                );


            if (result.success) {

                // ----------------------------------------------
                // RECORD ACTUAL MONEY SPENT
                // ----------------------------------------------

                totalInvestment +=
                    result.cost;


                await ns.write(
                    investmentFile,
                    String(totalInvestment),
                    "w"
                );


                // ----------------------------------------------
                // ACTION DISPLAY
                // ----------------------------------------------

                lastAction =
                    `${decision.type.toUpperCase()} ` +
                    `${
                        decision.type === "purchase"
                            ? `NODE #${decision.newIndex}`
                            : `#${decision.index}`
                    } | ` +
                    `Cost $${ns.format.number(
                        result.cost,
                        2
                    )} | ` +
                    `+$${ns.format.number(
                        decision.gain,
                        4
                    )}/s`;
            }
        }


        // ======================================================
        // REFRESH HUD
        // ======================================================

        ns.clearLog();


        printHeartbeat(
            ns,
            CONFIG,
            money,
            available,
            lastAction,
            decision,
            totalInvestment
        );


        // ------------------------------------------------------
        // LOOP DELAY
        // ------------------------------------------------------

        await ns.sleep(
            CONFIG.loopMs
        );
    }
}


// ==========================================================
// LOAD INVESTMENT
// ==========================================================

function loadInvestment(
    ns,
    filename
) {

    const raw =
        ns.read(filename);


    if (!raw) {
        return 0;
    }


    const value =
        Number(raw);


    if (
        !Number.isFinite(value) ||
        value < 0
    ) {

        return 0;
    }


    return value;
}


// ==========================================================
// FIND CHEAPEST INVESTMENT
// ==========================================================

function findCheapestInvestment(
    ns,
    config,
    available
) {

    if (available <= 0) {
        return null;
    }


    const candidates = [];

    const nodeCount =
        ns.hacknet.numNodes();


    // ========================================================
    // NEW NODE
    // ========================================================

    if (
        nodeCount < config.maxNodes
    ) {

        const cost =
            ns.hacknet.getPurchaseNodeCost();


        if (
            Number.isFinite(cost) &&
            cost > 0 &&
            cost <= available
        ) {

            const gain =
                estimateNewNodeProduction(ns);


            if (
                gain >
                config.minProductionGain
            ) {

                candidates.push({
                    type: "purchase",
                    index: -1,
                    newIndex: nodeCount,
                    cost,
                    gain
                });
            }
        }
    }


    // ========================================================
    // EXISTING NODE UPGRADES
    // ========================================================

    for (
        let index = 0;
        index < nodeCount;
        index++
    ) {

        const stats =
            ns.hacknet.getNodeStats(
                index
            );


        // ----------------------------------------------------
        // LEVEL
        // ----------------------------------------------------

        evaluateUpgrade(
            ns,
            available,
            candidates,
            index,
            stats,
            "level"
        );


        // ----------------------------------------------------
        // RAM
        // ----------------------------------------------------

        evaluateUpgrade(
            ns,
            available,
            candidates,
            index,
            stats,
            "ram"
        );


        // ----------------------------------------------------
        // CORE
        // ----------------------------------------------------

        evaluateUpgrade(
            ns,
            available,
            candidates,
            index,
            stats,
            "core"
        );
    }


    // ========================================================
    // NOTHING AFFORDABLE
    // ========================================================

    if (
        candidates.length === 0
    ) {

        return null;
    }


    // ========================================================
    // CHEAPEST FIRST
    // ========================================================

    candidates.sort(
        (a, b) =>
            a.cost - b.cost
    );


    // ========================================================
    // RETURN CHEAPEST
    // ========================================================

    return candidates[0];
}


// ==========================================================
// EVALUATE UPGRADE
// ==========================================================

function evaluateUpgrade(
    ns,
    available,
    candidates,
    index,
    stats,
    type
) {

    let cost;


    // --------------------------------------------------------
    // GET COST
    // --------------------------------------------------------

    switch (type) {

        case "level":

            cost =
                ns.hacknet.getLevelUpgradeCost(
                    index,
                    1
                );

            break;


        case "ram":

            cost =
                ns.hacknet.getRamUpgradeCost(
                    index,
                    1
                );

            break;


        case "core":

            cost =
                ns.hacknet.getCoreUpgradeCost(
                    index,
                    1
                );

            break;


        default:

            return;
    }


    // --------------------------------------------------------
    // INVALID / MAXED / UNAFFORDABLE
    // --------------------------------------------------------

    if (
        !Number.isFinite(cost) ||
        cost <= 0 ||
        cost > available
    ) {

        return;
    }


    // --------------------------------------------------------
    // CURRENT PRODUCTION
    // --------------------------------------------------------

    const current =
        stats.production;


    if (
        !Number.isFinite(current) ||
        current < 0
    ) {

        return;
    }


    // --------------------------------------------------------
    // CALCULATE PRODUCTION GAIN
    // --------------------------------------------------------

    let gain = 0;


    switch (type) {

        // ----------------------------------------------------
        // LEVEL
        // ----------------------------------------------------

        case "level":

            if (
                stats.level > 0
            ) {

                gain =
                    current /
                    stats.level;
            }

            break;


        // ----------------------------------------------------
        // RAM
        // ----------------------------------------------------

        case "ram": {

            const currentRamMultiplier =
                Math.pow(
                    1.035,
                    stats.ram - 1
                );


            const newRam =
                stats.ram * 2;


            const newRamMultiplier =
                Math.pow(
                    1.035,
                    newRam - 1
                );


            gain =
                current *
                (
                    newRamMultiplier /
                    currentRamMultiplier -
                    1
                );

            break;
        }


        // ----------------------------------------------------
        // CORE
        // ----------------------------------------------------

        case "core": {

            const currentCoreMultiplier =
                1 +
                (stats.cores - 1) / 5;


            const newCoreMultiplier =
                1 +
                stats.cores / 5;


            gain =
                current *
                (
                    newCoreMultiplier /
                    currentCoreMultiplier -
                    1
                );

            break;
        }
    }


    // --------------------------------------------------------
    // SANITY CHECK
    // --------------------------------------------------------

    if (
        !Number.isFinite(gain) ||
        gain <= 0
    ) {

        return;
    }


    // --------------------------------------------------------
    // ADD CANDIDATE
    // --------------------------------------------------------

    candidates.push({
        type,
        index,
        cost,
        gain
    });
}


// ==========================================================
// ESTIMATE NEW NODE PRODUCTION
// ==========================================================

function estimateNewNodeProduction(ns) {

    // --------------------------------------------------------
    // FORMULAS API
    // --------------------------------------------------------

    if (
        ns.formulas &&
        ns.formulas.hacknetNodes &&
        typeof ns.formulas.hacknetNodes.moneyGainRate ===
            "function"
    ) {

        try {

            return Math.max(
                0,
                ns.formulas.hacknetNodes.moneyGainRate(
                    1,
                    1,
                    1,
                    ns.getHacknetMultipliers().production
                )
            );

        } catch {
            // Fall through.
        }
    }


    // --------------------------------------------------------
    // FALLBACK
    // --------------------------------------------------------

    const multipliers =
        ns.getHacknetMultipliers();


    const productionMultiplier =
        Number.isFinite(
            multipliers.production
        )
            ? multipliers.production
            : 1;


    return (
        1.55 *
        productionMultiplier
    );
}


// ==========================================================
// EXECUTE INVESTMENT
// ==========================================================

function executeInvestment(
    ns,
    decision
) {

    // ========================================================
    // NEW NODE
    // ========================================================

    if (
        decision.type === "purchase"
    ) {

        const before =
            ns.getPlayer().money;


        const index =
            ns.hacknet.purchaseNode();


        if (index === -1) {

            return {
                success: false,
                cost: 0
            };
        }


        const after =
            ns.getPlayer().money;


        return {
            success: true,
            cost: Math.max(
                0,
                before - after
            )
        };
    }


    // ========================================================
    // LEVEL
    // ========================================================

    if (
        decision.type === "level"
    ) {

        const before =
            ns.getPlayer().money;


        const success =
            ns.hacknet.upgradeLevel(
                decision.index,
                1
            );


        const after =
            ns.getPlayer().money;


        return {
            success,
            cost: Math.max(
                0,
                before - after
            )
        };
    }


    // ========================================================
    // RAM
    // ========================================================

    if (
        decision.type === "ram"
    ) {

        const before =
            ns.getPlayer().money;


        const success =
            ns.hacknet.upgradeRam(
                decision.index,
                1
            );


        const after =
            ns.getPlayer().money;


        return {
            success,
            cost: Math.max(
                0,
                before - after
            )
        };
    }


    // ========================================================
    // CORE
    // ========================================================

    if (
        decision.type === "core"
    ) {

        const before =
            ns.getPlayer().money;


        const success =
            ns.hacknet.upgradeCore(
                decision.index,
                1
            );


        const after =
            ns.getPlayer().money;


        return {
            success,
            cost: Math.max(
                0,
                before - after
            )
        };
    }


    return {
        success: false,
        cost: 0
    };
}


// ==========================================================
// HUD
// ==========================================================

function printHeartbeat(
    ns,
    config,
    money,
    available,
    lastAction,
    decision,
    totalInvestment
) {

    // --------------------------------------------------------
    // NODE DATA
    // --------------------------------------------------------

    const nodes =
        ns.hacknet.numNodes();


    let production = 0;


    for (
        let i = 0;
        i < nodes;
        i++
    ) {

        production +=
            ns.hacknet.getNodeStats(
                i
            ).production;
    }


    // --------------------------------------------------------
    // NEXT UPGRADE
    // --------------------------------------------------------

    let next =
        "NONE";


    if (
        decision !== null
    ) {

        if (
            decision.type === "purchase"
        ) {

            next =
                `NEW NODE #${decision.newIndex}`;

        } else {

            const node =
                ns.hacknet.getNodeStats(
                    decision.index
                );


            next =
                `${decision.type.toUpperCase()} ` +
                `#${decision.index} ` +
                `(${getUpgradeName(
                    decision.type,
                    node
                )})`;
        }
    }


    // ========================================================
    // HEADER
    // ========================================================

    ns.print(
        "╔══════════════════════════════════════════════════╗"
    );

    ns.print(
        "║              HACKNET MANAGER                    ║"
    );

    ns.print(
        "╠══════════════════════════════════════════════════╣"
    );


    // ========================================================
    // HACKNET STATUS
    // ========================================================

    ns.print(
        "║ HACKNET STATUS                                   ║"
    );

    ns.print(
        `║ Nodes       : ${padRight(
            `${nodes}/${config.maxNodes}`,
            33
        )}║`
    );

    ns.print(
        `║ Production  : ${padRight(
            `$${ns.format.number(
                production,
                2
            )}/s`,
            33
        )}║`
    );

    ns.print(
        `║ Cash        : ${padRight(
            `$${ns.format.number(
                money,
                2
            )}`,
            33
        )}║`
    );

    ns.print(
        `║ Available   : ${padRight(
            `$${ns.format.number(
                available,
                2
            )}`,
            33
        )}║`
    );

    ns.print(
        `║ Investment  : ${padRight(
            `$${ns.format.number(
                totalInvestment,
                2
            )}`,
            33
        )}║`
    );


    // ========================================================
    // NEXT UPGRADE
    // ========================================================

    ns.print(
        "╠══════════════════════════════════════════════════╣"
    );

    ns.print(
        "║ NEXT UPGRADE                                     ║"
    );

    ns.print(
        `║ Target      : ${padRight(
            next,
            33
        )}║`
    );

    ns.print(
        `║ Cost        : ${padRight(
            decision !== null
                ? `$${ns.format.number(
                    decision.cost,
                    2
                )}`
                : "$0.00",
            33
        )}║`
    );

    ns.print(
        `║ Production  : ${padRight(
            decision !== null
                ? `+$${ns.format.number(
                    decision.gain,
                    4
                )}/s`
                : "$0.0000/s",
            33
        )}║` 
    );


    // ========================================================
    // LAST ACTION
    // ========================================================

    ns.print(
        "╠══════════════════════════════════════════════════╣"
    );

    ns.print(
        "║ LAST ACTION                                      ║"
    );

    ns.print(
        `║ ${padRight(
            lastAction,
            47
        )}║`
    );


    // ========================================================
    // FOOTER
    // ========================================================

    ns.print(
        "╚══════════════════════════════════════════════════╝"
    );
}


// ==========================================================
// UPGRADE NAME
// ==========================================================

function getUpgradeName(
    type,
    node
) {

    switch (type) {

        case "level":

            return (
                `Level ${node.level} → ` +
                `${node.level + 1}`
            );


        case "ram":

            return (
                `RAM ${node.ram}GB → ` +
                `${node.ram * 2}GB`
            );


        case "core":

            return (
                `Cores ${node.cores} → ` +
                `${node.cores + 1}`
            );


        default:

            return "Unknown";
    }
}


// ==========================================================
// PAD TEXT
// ==========================================================

function padRight(
    text,
    length
) {

    text =
        String(text);


    if (
        text.length >= length
    ) {

        return text.slice(
            0,
            length
        );
    }


    return (
        text +
        " ".repeat(
            length - text.length
        )
    );
}
