import * as pulumi from "@pulumi/pulumi";
import * as azureNative from "@pulumi/azure-native";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";

const stack = pulumi.getStack();
const resourceGroupName = `gitex-app-resourcegroup-${stack}`;
const appServicePlanName = `gitex-app-plan-${stack}`;
const storageAccountName = `gitexstore${stack}`;
const webAppName = `gitex-app-${stack}`;

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup(resourceGroupName, {
    resourceGroupName,
    location: "EastUS"
});

// Create an Azure resource (Storage Account)
const storageAccount = new storage.StorageAccount(storageAccountName, {
    accountName: storageAccountName,
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

const appServicePlan = new azureNative.web.AppServicePlan(appServicePlanName,
{
    name: appServicePlanName,
    kind: "app",
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    sku: {
        capacity: 1,
        name: "P2V2",
        size: "P2V2",
        tier: "PremiumV2"
    }
});

const webApp = new azureNative.web.WebApp(webAppName, {
    name: webAppName,
    resourceGroupName: resourceGroup.name,
    serverFarmId: appServicePlan.id,
    location: resourceGroup.location
});