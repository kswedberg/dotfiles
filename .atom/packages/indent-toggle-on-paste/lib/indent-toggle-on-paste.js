"use babel";

import { CompositeDisposable } from "atom";

let fPaste, fActivate, fDeactivate, oDisposables;

fPaste = function() {
    let bCurrentConfigValue = atom.config.get( "editor.autoIndentOnPaste" );

    atom.config.set( "editor.autoIndentOnPaste", !bCurrentConfigValue );
    atom.workspace.getActiveTextEditor().pasteText();
    atom.config.set( "editor.autoIndentOnPaste", bCurrentConfigValue );
};

fActivate = function() {
    oDisposables && oDisposables.dispose();
    oDisposables = new CompositeDisposable();

    oDisposables.add( atom.commands.add( "atom-text-editor:not([mini])", {
        "indent-toggle-on-paste:paste": fPaste.bind( null )
    } ) );
};

fDeactivate = function() {
    oDisposables.dispose();
};

export {
    fActivate as activate,
    fDeactivate as deactivate
};
