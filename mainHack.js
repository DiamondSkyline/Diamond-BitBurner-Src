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

    const YELLOW =
        "\x1b[38;2;241;250;140m";

    const GREEN =
        "\x1b[38;2;80;250;123m";

    const CYAN =
        "\x1b[38;2;139;233;253m";

    const PURPLE =
        "\x1b[38;2;189;147;249m";

    const WHITE =
        "\x1b[38;2;248;248;242m";


    // ==========================================
    // TARGET
    // ==========================================

    const target =
        ns.args[0];


    if (!target) {

        ns.tprint(
            `${RED}ERROR:${RESET} No target supplied.`
        );

        return;
    }


    // ==========================================
    // MAIN LOOP
    // ==========================================

    while (true) {

        // --------------------------------------
        // SECURITY
        // --------------------------------------

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


        // --------------------------------------
        // MONEY
        // --------------------------------------

        const money =
            ns.getServerMoneyAvailable(
                target
            );

        const maximumMoney =
            ns.getServerMaxMoney(
                target
            );

        const moneyPercent =
            maximumMoney > 0
                ? money / maximumMoney
                : 0;


        // ======================================
        // WEAKEN
        // ======================================

        if (
            securityDifference > 0.5
        ) {

            ns.clearLog();


            ns.print(
                `${PURPLE}========== MAINHACK ==========${RESET}`
            );

            ns.print("");


            ns.print(
                `${YELLOW}Target   :${RESET} ` +
                `${WHITE}${target}${RESET}`
            );


            ns.print(
                `${YELLOW}Action   :${RESET} ` +
                `${RED}WEAKEN${RESET}`
            );


            ns.print(
                `${YELLOW}Security :${RESET} ` +
                `${WHITE}${ns.format.number(
                    security,
                    2
                )}${RESET} / ` +
                `${WHITE}${ns.format.number(
                    minimumSecurity,
                    2
                )}${RESET} ` +
                `${RED}(+${ns.format.number(
                    securityDifference,
                    2
                )})${RESET}`
            );


            ns.print(
                `${YELLOW}Money    :${RESET} ` +
                `${WHITE}${ns.format.percent(
                    moneyPercent,
                    2
                )}${RESET}`
            );


            await ns.weaken(
                target
            );
        }


        // ======================================
        // GROW
        // ======================================

        else if (
            moneyPercent < 0.75
        ) {

            ns.clearLog();


            ns.print(
                `${PURPLE}========== MAINHACK ==========${RESET}`
            );

            ns.print("");


            ns.print(
                `${YELLOW}Target   :${RESET} ` +
                `${WHITE}${target}${RESET}`
            );


            ns.print(
                `${YELLOW}Action   :${RESET} ` +
                `${GREEN}GROW${RESET}`
            );


            ns.print(
                `${YELLOW}Security :${RESET} ` +
                `${WHITE}${ns.format.number(
                    security,
                    2
                )}${RESET} / ` +
                `${WHITE}${ns.format.number(
                    minimumSecurity,
                    2
                )}${RESET}`
            );


            ns.print(
                `${YELLOW}Money    :${RESET} ` +
                `${WHITE}${ns.format.percent(
                    moneyPercent,
                    2
                )}${RESET}`
            );


            await ns.grow(
                target
            );
        }


        // ======================================
        // HACK
        // ======================================

        else {

            ns.clearLog();


            ns.print(
                `${PURPLE}========== MAINHACK ==========${RESET}`
            );

            ns.print("");


            ns.print(
                `${YELLOW}Target   :${RESET} ` +
                `${WHITE}${target}${RESET}`
            );


            ns.print(
                `${YELLOW}Action   :${RESET} ` +
                `${CYAN}HACK${RESET}`
            );


            ns.print(
                `${YELLOW}Security :${RESET} ` +
                `${WHITE}${ns.format.number(
                    security,
                    2
                )}${RESET} / ` +
                `${WHITE}${ns.format.number(
                    minimumSecurity,
                    2
                )}${RESET}`
            );


            ns.print(
                `${YELLOW}Money    :${RESET} ` +
                `${WHITE}${ns.format.percent(
                    moneyPercent,
                    2
                )}${RESET}`
            );


            await ns.hack(
                target
            );
        }
    }
}
