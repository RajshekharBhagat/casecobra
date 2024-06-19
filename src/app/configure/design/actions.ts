'use server';

import { dbConnect } from "@/lib/dbConnect";
import ConfigurationModel, { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from "@/models/configuration";

export type SaveConfigArgs = {
    color: CaseColor,
    finish: CaseFinish,
    material: CaseMaterial,
    model: PhoneModel,
    configId: string,
}

export async function saveConfig({color, finish, material, model, configId}: SaveConfigArgs) {
    await dbConnect();
    try {
        const updatedConfiguration = await ConfigurationModel.findByIdAndUpdate(configId,{
            caseColor: color,
            caseFinish: finish,
            caseMaterial: material,
            phoneModel: model,
        },{
            new: true,
        })
        if(!updatedConfiguration) {
            throw new Error('Failed to update the configuration')
        }
    } catch (error) {
        console.log('Something went wrong while updating the configuration: ',error)
    }
}