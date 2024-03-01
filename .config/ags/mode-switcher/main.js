const hyprland = await Service.import('hyprland')

const monitor = hyprland.monitors.at(hyprland.active.monitor.id)
const width = monitor?.width;
const height = monitor?.height;

console.log(width, height);

const selected_option_data = {
    current_selected: 4,
    selected_options: []
}

const SelectMenu = () => {
    return Widget.Box({
        class_name: "select-menu",
        css: `
            min-width: ${width}px;
            min-height: ${height * 1.5}px;
        `,
        vertical: true,
        children: [
            Widget.Box({
                hpack: 'center',
                vexpand: true,
                class_name: "select-menu-wrapper",
                children: [
                    SelectMenuItem("reboot",    "", selected_option_data, 0, () => {App.Quit(); Utils.execAsync('systemctl reboot')}),
                    SelectMenuItem("shutdown",  "", selected_option_data, 1, () => {App.Quit(); Utils.execAsync('systemctl poweroff')}),
                    SelectMenuItem("lock",      "", selected_option_data, 2, () => {App.Quit(); Utils.execAsync(['hyprlock'])}),
                    SelectMenuItem("sleep",     "", selected_option_data, 3, () => {App.Quit(); Utils.execAsync('systemctl suspend')}),
                    SelectMenuItem("close",     "", selected_option_data, 4, () => {App.Quit()})
                ]
            })
        ]
    });
}

const SelectMenuItem = (
    /** @type {string} */ label, 
    /** @type {string */ icon_label,
    /** @type {object} */ selected_option_data,
    /** @type {int} */ index,
    /** @type {function} */ run_function,
) => {
    const select_menu_item = Widget.Box({
        vpack: "center",
        hpack: "center",
        vertical: true,
        vexpand: true,
        class_names: ["select-menu-option"],
        children: [
            Widget.Label({
                vpack: "center",
                vexpand: true,
                class_name: "select-menu-icon",
                label: icon_label
            }),
            Widget.Label({
                class_name: "select-menu-name",
                label
            })
        ]
    })

    // insert at index
    selected_option_data.selected_options.splice(index, 0, select_menu_item);

    const parent = Widget.EventBox({
        on_hover: (self) => {
            const current_selected = selected_option_data.current_selected;
            selected_option_data.selected_options.at(current_selected).class_names = ["select-menu-option"];
            select_menu_item.class_names = ["select-menu-option", "selected-menu-option"];
            selected_option_data.current_selected = index;
            self.grab_focus();
        },
        on_primary_click: () => {run_function()},
        child: select_menu_item
    });

    selected_option_data.parent = parent;
    return parent;
}

const SelectMenuWindow = Widget.Window({ 
    keymode: "on-demand",
    layer: "overlay",
    class_name: "select-window",
    name: "sessionmenu",
    child: SelectMenu(),
    margins: [0, 0],
}).keybind("Tab", () => {
    let next_selected = selected_option_data.current_selected + 1;
    
    if (next_selected > selected_option_data.selected_options.length - 1) {
        next_selected = 0
    }

    const current_selected = selected_option_data.current_selected;
    selected_option_data.selected_options.at(current_selected).class_names = ["select-menu-option"];
    selected_option_data.selected_options.at(next_selected).class_names = ["select-menu-option", "selected-menu-option"];
    selected_option_data.current_selected = next_selected;

}).keybind("Escape", (self) => {
    App.Quit();
}).keybind("space", () => {
    const current_selected = selected_option_data.current_selected;
    selected_option_data.selected_options.at(current_selected).parent.on_primary_click();
});


export default {
    style: './style.css',
    windows: [SelectMenuWindow],
}