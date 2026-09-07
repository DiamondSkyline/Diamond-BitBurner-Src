/** @param {NS} ns */
export async function main(ns) {

    ns.disableLog("ALL");


    // ============================================================
    // CONFIG
    // ============================================================

    const REFRESH =
        1000;

    const TARGET =
        String(
            ns.args[0] ||
            "n00dles"
        );

    const WORKER =
        "mainHack.js";


    // ============================================================
    // DRACULA PALETTE
    // ============================================================

    const C = {

        bg:
            "#282a36",

        panel:
            "#21222c",

        panel2:
            "#343746",

        border:
            "#44475a",

        white:
            "#f8f8f2",

        gray:
            "#6272a4",

        green:
            "#50fa7b",

        red:
            "#ff5555",

        yellow:
            "#f1fa8c",

        cyan:
            "#8be9fd",

        purple:
            "#bd93f9",

        orange:
            "#ffb86c",

        pink:
            "#ff79c6",
    };


    // ============================================================
    // REACT
    //
    // Intentionally NO JSX.
    //
    // This avoids Bitburner parser-sensitive constructs.
    // ============================================================

    const h =
        React.createElement;


    // ============================================================
    // WINDOW
    // ============================================================

    ns.ui.openTail();

    ns.ui.setTailTitle(
        "STAT.TSX"
    );

    ns.ui.resizeTail(
        1000,
        900
    );

    ns.ui.moveTail(
        20,
        20
    );


    // ============================================================
    // FORMATTERS
    // ============================================================

    function money(
        value
    ) {

        if (
            !Number.isFinite(
                value
            )
        ) {
            return "$0";
        }


        if (
            Math.abs(value) >=
            1e15
        ) {

            return (
                "$" +
                (
                    value /
                    1e15
                ).toFixed(2) +
                "q"
            );
        }


        if (
            Math.abs(value) >=
            1e12
        ) {

            return (
                "$" +
                (
                    value /
                    1e12
                ).toFixed(2) +
                "t"
            );
        }


        if (
            Math.abs(value) >=
            1e9
        ) {

            return (
                "$" +
                (
                    value /
                    1e9
                ).toFixed(2) +
                "b"
            );
        }


        if (
            Math.abs(value) >=
            1e6
        ) {

            return (
                "$" +
                (
                    value /
                    1e6
                ).toFixed(2) +
                "m"
            );
        }


        if (
            Math.abs(value) >=
            1e3
        ) {

            return (
                "$" +
                (
                    value /
                    1e3
                ).toFixed(1) +
                "k"
            );
        }


        return (
            "$" +
            value.toFixed(0)
        );
    }


    function ram(
        value
    ) {

        if (
            !Number.isFinite(
                value
            )
        ) {
            return "0GB";
        }


        if (
            value >=
            1024 * 1024
        ) {

            return (
                (
                    value /
                    1024 /
                    1024
                ).toFixed(1) +
                "PB"
            );
        }


        if (
            value >=
            1024
        ) {

            return (
                (
                    value /
                    1024
                ).toFixed(1) +
                "TB"
            );
        }


        return (
            value.toFixed(0) +
            "GB"
        );
    }


    function percent(
        value
    ) {

        if (
            !Number.isFinite(
                value
            )
        ) {
            return "0.0%";
        }


        return (
            (
                value *
                100
            ).toFixed(1) +
            "%"
        );
    }


    function formatTime(
        milliseconds
    ) {

        if (
            !Number.isFinite(
                milliseconds
            ) ||
            milliseconds <= 0
        ) {

            return "N/A";
        }


        const seconds =
            milliseconds /
            1000;


        if (
            seconds < 60
        ) {

            return (
                seconds.toFixed(1) +
                "s"
            );
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
                minutes +
                "m " +
                remainingSeconds +
                "s"
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
            hours +
            "h " +
            remainingMinutes +
            "m"
        );
    }


    function number(
        value,
        decimals
    ) {

        if (
            !Number.isFinite(
                value
            )
        ) {

            return "0";
        }


        return ns.format.number(
            value,
            decimals
        );
    }


    function safeMoney(
        server
    ) {

        try {

            return ns.getServerMoneyAvailable(
                server
            );

        } catch {

            return 0;
        }
    }


    function safeMaxMoney(
        server
    ) {

        try {

            return ns.getServerMaxMoney(
                server
            );

        } catch {

            return 0;
        }
    }


    function safeGrowth(
        server
    ) {

        try {

            return ns.getServerGrowth(
                server
            );

        } catch {

            return 0;
        }
    }


    // ============================================================
    // NETWORK DISCOVERY
    // ============================================================

    function scanNetwork() {

        const network =
            [];

        const visited =
            new Set();

        const queue =
            ["home"];


        while (
            queue.length > 0
        ) {

            const server =
                queue.shift();


            if (
                !server ||
                visited.has(
                    server
                )
            ) {

                continue;
            }


            visited.add(
                server
            );

            network.push(
                server
            );


            for (
                const next of ns.scan(
                    server
                )
            ) {

                if (
                    !visited.has(
                        next
                    )
                ) {

                    queue.push(
                        next
                    );
                }
            }
        }


        return network;
    }


    // ============================================================
    // WORKER INFORMATION
    // ============================================================

    function getWorkerInfo(
        server
    ) {

        let processes =
            [];


        try {

            processes =
                ns.ps(
                    server
                );

        } catch {

            processes =
                [];
        }


        let processCount =
            0;

        let threads =
            0;


        const targets =
            new Set();


        for (
            const process of processes
        ) {

            if (
                process.filename !==
                WORKER
            ) {

                continue;
            }


            processCount++;

            threads +=
                process.threads;


            if (
                process.args &&
                process.args.length > 0
            ) {

                targets.add(
                    String(
                        process.args[0]
                    )
                );
            }
        }


        return {

            processCount:
                processCount,

            threads:
                threads,

            targets:
                targets,
        };
    }


    // ============================================================
    // CHEAPEST HACKNET UPGRADE
    // ============================================================

    function findCheapestUpgrade(
        available
    ) {

        const candidates =
            [];


        const nodes =
            ns.hacknet.numNodes();


        // --------------------------------------------------------
        // NEW NODE
        // --------------------------------------------------------

        if (
            nodes < 25
        ) {

            let cost =
                0;


            try {

                cost =
                    ns.hacknet.getPurchaseNodeCost();

            } catch {

                cost =
                    0;
            }


            if (
                Number.isFinite(
                    cost
                ) &&
                cost > 0 &&
                cost <= available
            ) {

                candidates.push({

                    name:
                        "NEW NODE #" +
                        nodes,

                    cost:
                        cost,

                    payback:
                        0,
                });
            }
        }


        // --------------------------------------------------------
        // NODE UPGRADES
        // --------------------------------------------------------

        for (
            let i = 0;
            i < nodes;
            i++
        ) {

            let levelCost =
                0;

            let ramCost =
                0;

            let coreCost =
                0;


            try {

                levelCost =
                    ns.hacknet.getLevelUpgradeCost(
                        i,
                        1
                    );

            } catch {

                levelCost =
                    0;
            }


            try {

                ramCost =
                    ns.hacknet.getRamUpgradeCost(
                        i,
                        1
                    );

            } catch {

                ramCost =
                    0;
            }


            try {

                coreCost =
                    ns.hacknet.getCoreUpgradeCost(
                        i,
                        1
                    );

            } catch {

                coreCost =
                    0;
            }


            if (
                Number.isFinite(
                    levelCost
                ) &&
                levelCost > 0 &&
                levelCost <= available
            ) {

                candidates.push({

                    name:
                        "LEVEL #" +
                        i,

                    cost:
                        levelCost,

                    payback:
                        0,
                });
            }


            if (
                Number.isFinite(
                    ramCost
                ) &&
                ramCost > 0 &&
                ramCost <= available
            ) {

                candidates.push({

                    name:
                        "RAM #" +
                        i,

                    cost:
                        ramCost,

                    payback:
                        0,
                });
            }


            if (
                Number.isFinite(
                    coreCost
                ) &&
                coreCost > 0 &&
                coreCost <= available
            ) {

                candidates.push({

                    name:
                        "CORE #" +
                        i,

                    cost:
                        coreCost,

                    payback:
                        0,
                });
            }
        }


        if (
            candidates.length === 0
        ) {

            return {

                name:
                    "NONE",

                cost:
                    0,

                payback:
                    0,
            };
        }


        candidates.sort(
            (
                a,
                b
            ) =>
                a.cost -
                b.cost
        );


        return candidates[0];
    }


    // ============================================================
    // UI HELPERS
    // ============================================================

    function text(
        value,
        color
    ) {

        return h(
            "span",
            {
                style: {

                    color:
                        color ||
                        C.white,
                },
            },
            String(
                value
            )
        );
    }


    function label(
        value
    ) {

        return text(
            value,
            C.gray
        );
    }


    function section(
        title
    ) {

        return h(
            "div",
            {
                style: {

                    marginTop:
                        "9px",

                    marginBottom:
                        "4px",

                    paddingBottom:
                        "3px",

                    borderBottom:
                        "1px solid " +
                        C.border,

                    color:
                        C.purple,

                    fontWeight:
                        "bold",

                    fontSize:
                        "14px",

                    letterSpacing:
                        "0.5px",
                },
            },

            "◈ " +
            title
        );
    }


    function twoColumnRow(
        leftLabel,
        leftValue,
        leftColor,
        rightLabel,
        rightValue,
        rightColor
    ) {

        return h(
            "div",
            {
                style: {

                    display:
                        "flex",

                    width:
                        "100%",

                    lineHeight:
                        "18px",

                    whiteSpace:
                        "nowrap",
                },
            },


            h(
                "div",
                {
                    style: {

                        width:
                            "50%",
                    },
                },

                text(
                    leftLabel +
                    " ",
                    C.gray
                ),

                text(
                    leftValue,
                    leftColor
                )
            ),


            h(
                "div",
                {
                    style: {

                        width:
                            "50%",
                    },
                },

                text(
                    rightLabel +
                    " ",
                    C.gray
                ),

                text(
                    rightValue,
                    rightColor
                )
            )
        );
    }


    function threeColumnRow(
        aLabel,
        aValue,
        aColor,

        bLabel,
        bValue,
        bColor,

        cLabel,
        cValue,
        cColor
    ) {

        return h(
            "div",
            {
                style: {

                    display:
                        "flex",

                    width:
                        "100%",

                    lineHeight:
                        "18px",

                    whiteSpace:
                        "nowrap",
                },
            },


            h(
                "div",
                {
                    style: {
                        width:
                            "33.33%",
                    },
                },

                text(
                    aLabel +
                    " ",
                    C.gray
                ),

                text(
                    aValue,
                    aColor
                )
            ),


            h(
                "div",
                {
                    style: {
                        width:
                            "33.33%",
                    },
                },

                text(
                    bLabel +
                    " ",
                    C.gray
                ),

                text(
                    bValue,
                    bColor
                )
            ),


            h(
                "div",
                {
                    style: {
                        width:
                            "33.33%",
                    },
                },

                text(
                    cLabel +
                    " ",
                    C.gray
                ),

                text(
                    cValue,
                    cColor
                )
            )
        );
    }


    // ============================================================
    // MAIN RENDER
    // ============================================================

    function render() {

        // ========================================================
        // PLAYER
        // ========================================================

        const player =
            ns.getPlayer();


        // ========================================================
        // NETWORK
        // ========================================================

        const servers =
            scanNetwork();


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
                ? usedRam /
                  totalRam
                : 0;


        // ========================================================
        // MAINHACK
        // ========================================================

        const workerRamCost =
            ns.getScriptRam(
                WORKER
            );


        let deploymentServers =
            0;

        let deploymentProcesses =
            0;

        let deploymentThreads =
            0;

        let deploymentRam =
            0;


        const uniqueTargets =
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


            const worker =
                getWorkerInfo(
                    server
                );


            if (
                worker.processCount >
                0
            ) {

                deploymentServers++;
            }


            deploymentProcesses +=
                worker.processCount;


            deploymentThreads +=
                worker.threads;


            deploymentRam +=
                worker.threads *
                workerRamCost;


            for (
                const target of worker.targets
            ) {

                uniqueTargets.add(
                    target
                );
            }
        }


        // ========================================================
        // TARGET
        // ========================================================

        let targetExists =
            false;

        let targetServer =
            null;


        try {

            targetExists =
                ns.serverExists(
                    TARGET
                );


            if (
                targetExists
            ) {

                targetServer =
                    ns.getServer(
                        TARGET
                    );
            }

        } catch {

            targetExists =
                false;

            targetServer =
                null;
        }


        let targetMoney =
            0;

        let targetMaxMoney =
            0;

        let targetGrowth =
            0;

        let security =
            0;

        let minimumSecurity =
            0;

        let targetRamUsed =
            0;

        let targetRamMax =
            0;

        let hackLevel =
            0;

        let ports =
            0;

        let portsRequired =
            0;

        let hackTime =
            0;

        let growTime =
            0;

        let weakenTime =
            0;


        if (
            targetExists
        ) {

            targetMoney =
                safeMoney(
                    TARGET
                );

            targetMaxMoney =
                safeMaxMoney(
                    TARGET
                );

            targetGrowth =
                safeGrowth(
                    TARGET
                );


            security =
                ns.getServerSecurityLevel(
                    TARGET
                );

            minimumSecurity =
                ns.getServerMinSecurityLevel(
                    TARGET
                );


            targetRamUsed =
                ns.getServerUsedRam(
                    TARGET
                );

            targetRamMax =
                ns.getServerMaxRam(
                    TARGET
                );


            hackLevel =
                targetServer.requiredHackingSkill ||
                0;


            ports =
                targetServer.openPortCount ||
                0;


            portsRequired =
                targetServer.numOpenPortsRequired ||
                0;


            try {

                hackTime =
                    ns.getHackTime(
                        TARGET
                    );

                growTime =
                    ns.getGrowTime(
                        TARGET
                    );

                weakenTime =
                    ns.getWeakenTime(
                        TARGET
                    );

            } catch {

                hackTime =
                    0;

                growTime =
                    0;

                weakenTime =
                    0;
            }
        }


        const moneyPercent =
            targetMaxMoney > 0
                ? targetMoney /
                  targetMaxMoney
                : 0;


        const securityDifference =
            security -
            minimumSecurity;


        // ========================================================
        // TARGET ACTION
        // ========================================================

        let action =
            "HACK";

        let actionColor =
            C.cyan;


        if (
            securityDifference >
            0.5
        ) {

            action =
                "WEAKEN";

            actionColor =
                C.red;

        } else if (
            moneyPercent <
            0.75
        ) {

            action =
                "GROW";

            actionColor =
                C.green;
        }


        // ========================================================
        // HACKNET
        // ========================================================

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


        // ========================================================
        // HACKNET INVESTMENT
        // ========================================================

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
                player.money *
                0.5
            );


        const hacknetAvailable =
            Math.max(
                0,
                player.money -
                reserve
            );


        const nextNodeCost =
            nodes < 25
                ? ns.hacknet.getPurchaseNodeCost()
                : 0;


        const nextUpgrade =
            findCheapestUpgrade(
                hacknetAvailable
            );


        // ========================================================
        // CLOUD SERVERS
        // ========================================================

        let cloudServers =
            [];

        let cloudLimit =
            0;

        let cloudRamLimit =
            0;


        try {

            cloudServers =
                ns.cloud.getServerNames();

            cloudLimit =
                ns.cloud.getServerLimit();

            cloudRamLimit =
                ns.cloud.getRamLimit();

        } catch {

            cloudServers =
                [];

            cloudLimit =
                0;

            cloudRamLimit =
                0;
        }


        // ========================================================
        // MONEY COLOR
        // ========================================================

        let targetMoneyColor =
            C.red;


        if (
            moneyPercent >=
            0.90
        ) {

            targetMoneyColor =
                C.green;

        } else if (
            moneyPercent >=
            0.50
        ) {

            targetMoneyColor =
                C.yellow;
        }


        // ========================================================
        // SECURITY COLOR
        // ========================================================

        let securityColor =
            C.green;


        if (
            securityDifference >
            5
        ) {

            securityColor =
                C.red;

        } else if (
            securityDifference >
            1
        ) {

            securityColor =
                C.yellow;
        }


        // ========================================================
        // RAM COLOR
        // ========================================================

        let ramColor =
            C.green;


        if (
            utilization >=
            0.90
        ) {

            ramColor =
                C.red;

        } else if (
            utilization >=
            0.75
        ) {

            ramColor =
                C.yellow;
        }


        // ========================================================
        // ROOT COLOR
        // ========================================================

        const rootColor =
            targetServer &&
            targetServer.hasAdminRights
                ? C.green
                : C.red;


        // ========================================================
        // BACKDOOR COLOR
        // ========================================================

        const backdoorColor =
            targetServer &&
            targetServer.backdoorInstalled
                ? C.green
                : C.yellow;


        // ========================================================
        // BUILD UI
        // ========================================================

        const children =
            [];


        // ========================================================
        // HEADER
        // ========================================================

        children.push(

            h(
                "div",
                {
                    style: {

                        display:
                            "flex",

                        alignItems:
                            "center",

                        background:
                            C.panel,

                        borderBottom:
                            "1px solid " +
                            C.purple,

                        padding:
                            "7px 10px",

                        marginBottom:
                            "5px",
                    },
                },


                h(
                    "div",
                    {
                        style: {

                            flex:
                                1,

                            color:
                                C.purple,

                            fontSize:
                                "20px",

                            fontWeight:
                                "bold",
                        },
                    },

                    "STAT.TSX"
                ),


                h(
                    "div",
                    {
                        style: {

                            color:
                                C.green,

                            fontWeight:
                                "bold",

                            fontSize:
                                "12px",
                        },
                    },

                    "● LIVE"
                )
            )
        );


        // ========================================================
        // PLAYER
        // ========================================================

        children.push(
            section(
                "PLAYER"
            )
        );


        children.push(
            twoColumnRow(
                "Hacking Level:",
                number(
                    player.skills.hacking,
                    0
                ),
                C.cyan,

                "Home Money:",
                money(
                    player.money
                ),
                C.green
            )
        );


        children.push(
            twoColumnRow(
                "Hacking EXP:",
                number(
                    player.exp.hacking,
                    0
                ),
                C.purple,

                "City:",
                player.city,
                C.white
            )
        );


        children.push(
            twoColumnRow(
                "Strength:",
                player.skills.strength,
                C.orange,

                "Defense:",
                player.skills.defense,
                C.orange
            )
        );


        children.push(
            twoColumnRow(
                "Dexterity:",
                player.skills.dexterity,
                C.orange,

                "Agility:",
                player.skills.agility,
                C.orange
            )
        );


        children.push(
            twoColumnRow(
                "Charisma:",
                player.skills.charisma,
                C.pink,

                "Intelligence:",
                player.skills.intelligence,
                C.cyan
            )
        );


        children.push(
            twoColumnRow(
                "Factions:",
                player.factions.length,
                C.purple,

                "Jobs:",
                Object.keys(
                    player.jobs || {}
                ).length,
                C.yellow
            )
        );


        // ========================================================
        // NETWORK
        // ========================================================

        children.push(
            section(
                "NETWORK"
            )
        );


        children.push(
            twoColumnRow(
                "Discovered:",
                servers.length,
                C.white,

                "Rooted:",
                rooted,
                C.green
            )
        );


        children.push(
            twoColumnRow(
                "RAM Capacity:",
                ram(
                    totalRam
                ),
                C.cyan,

                "RAM Used:",
                ram(
                    usedRam
                ),
                ramColor
            )
        );


        children.push(
            twoColumnRow(
                "RAM Available:",
                ram(
                    availableRam
                ),
                C.green,

                "Utilization:",
                percent(
                    utilization
                ),
                ramColor
            )
        );


        children.push(
            twoColumnRow(
                "Cloud Servers:",
                cloudServers.length +
                " / " +
                cloudLimit,
                C.purple,

                "Cloud RAM Limit:",
                ram(
                    cloudRamLimit
                ),
                C.cyan
            )
        );


        // ========================================================
        // MAINHACK
        // ========================================================

        children.push(
            section(
                "MAINHACK DEPLOYMENT"
            )
        );


        children.push(
            twoColumnRow(
                "Servers:",
                deploymentServers,
                C.white,

                "Processes:",
                deploymentProcesses,
                C.cyan
            )
        );


        children.push(
            twoColumnRow(
                "Threads:",
                number(
                    deploymentThreads,
                    0
                ),
                C.purple,

                "Worker RAM:",
                ram(
                    deploymentRam
                ),
                C.orange
            )
        );


        children.push(
            twoColumnRow(
                "Unique Targets:",
                uniqueTargets.size,
                C.white,

                "Target:",
                TARGET,
                C.cyan
            )
        );


        children.push(
            twoColumnRow(
                "Action:",
                action,
                actionColor,

                "Worker RAM/Thread:",
                ram(
                    workerRamCost
                ),
                C.gray
            )
        );


        // ========================================================
        // HACKNET
        // ========================================================

        children.push(
            section(
                "HACKNET"
            )
        );


        children.push(
            twoColumnRow(
                "Nodes:",
                nodes +
                " / 25",
                C.purple,

                "Production:",
                money(
                    hacknetProduction
                ) +
                "/s",
                C.green
            )
        );


        children.push(
            twoColumnRow(
                "Total Level:",
                totalLevel,
                C.cyan,

                "Total RAM:",
                ram(
                    totalHacknetRam
                ),
                C.orange
            )
        );


        children.push(
            twoColumnRow(
                "Total Cores:",
                totalCores,
                C.orange,

                "Total Invested:",
                money(
                    totalInvestment
                ),
                C.pink
            )
        );


        children.push(
            twoColumnRow(
                "Next Node:",
                nodes < 25
                    ? money(
                        nextNodeCost
                    )
                    : "MAX",
                C.green,

                "Best Upgrade:",
                nextUpgrade.name,
                C.yellow
            )
        );


        children.push(
            twoColumnRow(
                "Upgrade Cost:",
                money(
                    nextUpgrade.cost
                ),
                C.orange,

                "Available:",
                money(
                    hacknetAvailable
                ),
                C.cyan
            )
        );


        // ========================================================
        // TARGET SERVER
        // ========================================================

        children.push(
            section(
                "TARGET SERVER"
            )
        );


        if (
            !targetExists
        ) {

            children.push(

                h(
                    "div",
                    {
                        style: {

                            color:
                                C.red,

                            fontWeight:
                                "bold",

                            padding:
                                "5px",

                            background:
                                C.panel,
                        },
                    },

                    "TARGET NOT FOUND: " +
                    TARGET
                )
            );

        } else {

            children.push(
                twoColumnRow(
                    "Target:",
                    TARGET,
                    C.cyan,

                    "Root Access:",
                    targetServer.hasAdminRights
                        ? "YES"
                        : "NO",
                    rootColor
                )
            );


            children.push(
                twoColumnRow(
                    "Backdoor:",
                    targetServer.backdoorInstalled
                        ? "INSTALLED"
                        : "NO",
                    backdoorColor,

                    "Hack Level:",
                    hackLevel,
                    C.yellow
                )
            );


            children.push(
                twoColumnRow(
                    "Avail Balance:",
                    money(
                        targetMoney
                    ),
                    targetMoneyColor,

                    "Max Balance:",
                    money(
                        targetMaxMoney
                    ),
                    C.cyan
                )
            );


            children.push(
                twoColumnRow(
                    "Money Percent:",
                    percent(
                        moneyPercent
                    ),
                    targetMoneyColor,

                    "Growth:",
                    targetGrowth,
                    C.orange
                )
            );


            children.push(
                twoColumnRow(
                    "Action:",
                    action,
                    actionColor,

                    "Open Ports:",
                    ports +
                    " / " +
                    portsRequired,
                    ports >=
                    portsRequired
                        ? C.green
                        : C.red
                )
            );
        }


        // ========================================================
        // SECURITY
        // ========================================================

        children.push(
            section(
                "SECURITY"
            )
        );


        children.push(
            twoColumnRow(
                "Current Level:",
                number(
                    security,
                    2
                ),
                securityColor,

                "Minimum Level:",
                number(
                    minimumSecurity,
                    2
                ),
                C.cyan
            )
        );


        children.push(
            twoColumnRow(
                "Difference:",
                (
                    securityDifference >= 0
                        ? "+"
                        : ""
                ) +
                number(
                    securityDifference,
                    2
                ),
                securityColor,

                "Status:",
                securityDifference >
                    5
                    ? "HIGH"
                    : securityDifference >
                      1
                        ? "ELEVATED"
                        : "OPTIMAL",
                securityColor
            )
        );


        // ========================================================
        // RAM
        // ========================================================

        children.push(
            section(
                "RAM"
            )
        );


        const targetFreeRam =
            Math.max(
                0,
                targetRamMax -
                targetRamUsed
            );


        const targetUtilization =
            targetRamMax > 0
                ? targetRamUsed /
                  targetRamMax
                : 0;


        children.push(
            twoColumnRow(
                "Used:",
                ram(
                    targetRamUsed
                ),
                C.orange,

                "Free:",
                ram(
                    targetFreeRam
                ),
                C.green
            )
        );


        children.push(
            twoColumnRow(
                "Max:",
                ram(
                    targetRamMax
                ),
                C.cyan,

                "Utilization:",
                percent(
                    targetUtilization
                ),
                targetUtilization >=
                    0.90
                    ? C.red
                    : C.white
            )
        );


        // ========================================================
        // TIMERS
        // ========================================================

        children.push(
            section(
                "TIMERS"
            )
        );


        children.push(
            twoColumnRow(
                "Hack:",
                formatTime(
                    hackTime
                ),
                C.green,

                "Grow:",
                formatTime(
                    growTime
                ),
                C.orange
            )
        );


        children.push(
            twoColumnRow(
                "Weaken:",
                formatTime(
                    weakenTime
                ),
                C.cyan,

                "Cycle:",
                formatTime(
                    Math.max(
                        hackTime,
                        growTime,
                        weakenTime
                    )
                ),
                C.purple
            )
        );


        // ========================================================
        // FOOTER
        // ========================================================

        children.push(

            h(
                "div",
                {
                    style: {

                        marginTop:
                            "9px",

                        paddingTop:
                            "5px",

                        borderTop:
                            "1px solid " +
                            C.border,

                        color:
                            C.gray,

                        fontSize:
                            "11px",

                        whiteSpace:
                            "nowrap",
                    },
                },

                "Worker Spider online",
                "  |  ",
                "Monitoring ",
                String(
                    servers.length
                ),
                " servers",
                "  |  ",
                "mainHack.js: ",
                String(
                    deploymentThreads
                ),
                " threads",
                "  |  ",
                "Target: ",
                TARGET
            )
        );


        // ========================================================
        // ROOT ELEMENT
        // ========================================================

        const root =
            h(
                "div",
                {
                    style: {

                        width:
                            "1000px",

                        minHeight:
                            "100%",

                        boxSizing:
                            "border-box",

                        padding:
                            "9px",

                        background:
                            C.bg,

                        color:
                            C.white,

                        fontFamily:
                            "monospace",

                        fontSize:
                            "13px",

                        lineHeight:
                            "1.25",

                        overflow:
                            "hidden",
                    },
                },

                children
            );


        // ========================================================
        // PRINT
        // ========================================================

        ns.clearLog();

        ns.printRaw(
            root
        );
    }


    // ============================================================
    // INITIAL RENDER
    // ============================================================

    render();


    // ============================================================
    // LIVE UPDATE
    // ============================================================

    while (
        true
    ) {

        await ns.sleep(
            REFRESH
        );


        try {

            render();

        } catch (
            error
        ) {

            ns.print(
                "STAT.TSX error: " +
                String(
                    error
                )
            );
        }
    }
}
