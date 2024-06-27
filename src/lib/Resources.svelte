<script>
    import List, { Item, Graphic, Separator, Text } from '@smui/list';
    import {LeagueDynasty} from "$lib/stores.js";

    let dynasty;
    LeagueDynasty.subscribe(value => { dynasty = value; });

    const today = new Date();
    const resources = [
        {
          name: "Toutes les ressources",
          url: "https://fantasyballers.substack.com/p/ressources-fantasy-football?r=3l7xw4&utm_campaign=post&utm_medium=web",
          icon: "insights",
          premium: false,
          separator: true
        },
        {
            name: "Fantasy Pros",
            url: "https://www.fantasypros.com",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "Sleeper ADP",
            url: "https://docs.google.com/spreadsheets/d/1wmjxi3K5rjIYME_lskUvquLbN331YV0vi-kg5VakpdY/edit",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "TheScore Draft Kit",
            url: "https://www.thescore.com/nfl/news/2187753",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "TheRinger Draft Kit",
            url: "https://fantasyfootball.theringer.com/",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "FantasyPros Draft Kit",
            url: "https://www.fantasypros.com/2024-fantasy-football-draft-kit/",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "FantasyPros Dynasty Trade Value Chart",
            url: `https://www.fantasypros.com/${today.getFullYear()}/${today.getMonth() + 1}/fantasy-football-rankings-dynasty-trade-value-chart-${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}-update/`,
            icon: "assessment",
            premium: false,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "KeepTradeCut",
            url: "https://keeptradecut.com/",
            icon: "calculate",
            premium: false,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "FantasyCalc",
            url: "https://dynastyleaguefootball.com/",
            icon: "calculate",
            premium: true,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "FantasyLife",
            url: "https://www.fantasylife.com/tools/nfl-rookie-wr-model",
            icon: "article",
            premium: false,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "DraftSharks",
            url: "https://www.draftsharks.com/kb/nfl-draft-prospects",
            icon: "insights",
            premium: false,
            separator: true,
            redraftOnly: true,
        },
        {
            name: "FantasyFootballers",
            url: "https://www.thefantasyfootballers.com",
            icon: "article",
            premium: false,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "Dynasty Nerds GM",
            url: "https://gm.dynastynerds.com/",
            icon: "insights",
            premium: true,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "Fantasy Football Trade Analyzer",
            url: `https://fantasyfootballcalculator.com/trade-analyzer`,
            icon: "calculate",
            premium: false,
            separator: true,
            redraftOnly: true,
        },
        {
            name: "DynastyDaddy",
            url: "https://dynasty-daddy.com/",
            icon: "assessment",
            premium: false,
            separator: true,
            dynastyOnly: true,
        },
        {
            name: "DynastyDataLabs",
            url: "https://dynastydatalab.com/",
            icon: "calculate",
            premium: false,
            separator: false,
            dynastyOnly: true,
        },
    ];
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</svelte:head>


<style>
    .pageBody {
        position: relative;
        z-index: 1;
    }

    :global(.list) {
        width: 90%;
        max-width: 800px;
        border: 1px solid
        var(--mdc-theme-text-hint-on-background, var(--d7d7d7));
        margin: 15px auto;
        padding: 0 !important;
        box-shadow: 0px 3px 3px -2px var(--boxShadowOne), 0px 3px 4px 0px var(--boxShadowTwo), 0px 1px 8px 0px var(--boxShadowThree);
    }


    :global(.linkText) {
        font-size: 1.1em;
    }

    a {
        color: var(--g555);
        font-size: 1.1em;
        text-decoration: none;
    }

    h4 {
        text-align: center;
    }

    .disclaimer {
        color: #888;
        text-align: center;
    }
</style>

<div class="pageBody">
    <div class="banner">
        <h4>FantasyBallers Social</h4>
        <List class="list" dense>
            <a target="_blank" href="https://fr.tipeee.com/fantasyballersfr">
                <Item>
                    <Graphic class="material-icons"><i class="fa-solid fa-dollar-sign"></i></Graphic>
                    <Text class="linkText">Tipeee</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://fantasyballers.substack.com">
                <Item>
                    <Graphic class="material-icons"><i class="fa-solid fa-newspaper"></i></Graphic>
                    <Text class="linkText">Substack</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://sleeper.com/topics/602214030764994560">
                <Item>
                    <Graphic class="material-icons"><i class="fa-solid fa-football"></i></Graphic>
                    <Text class="linkText">Sleeper</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://www.instagram.com/fantasyballersfr/">
                <Item>
                    <Graphic class="material-icons"><i class="material-icons fa-brands fa-instagram"></i></Graphic>
                    <Text class="linkText">Instagram</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://x.com/fantasyballersf?s=21">
                <Item>
                    <Graphic class="material-icons"><i class="fa-brands fa-twitter"></i></Graphic>
                    <Text class="linkText">Twitter</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://www.facebook.com/fantasyballersfr/">
                <Item>
                    <Graphic class="material-icons"><i class="fa-brands fa-facebook-f"></i></Graphic>
                    <Text class="linkText">Facebook</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://www.youtube.com/@FantasyBallers">
                <Item>
                    <Graphic class="material-icons"><i class="fa-brands fa-youtube"></i></Graphic>
                    <Text class="linkText">Youtube</Text>
                </Item>
                <Separator />
            </a>
            <a target="_blank" href="https://www.twitch.tv/fantasyballers">
                <Item>
                    <Graphic class="material-icons"><i class="fa-brands fa-twitch"></i></Graphic>
                    <Text class="linkText">Twitch</Text>
                </Item>
            </a>
        </List>
        <h4>Helpful Fantasy Resources</h4>
    </div>

    <List class="list" dense>
        {#each resources as resource}
            {#if resource.dynastyOnly && dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if resource.redraftOnly && !dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if !resource.redraftOnly && !resource.dynastyOnly}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {/if}
        {/each}
    </List>
    <p class="disclaimer">*Some or all content is behind a paywall</p>
</div>
