# --- Configuration Variables ---
$rg = "YOUR-RESOURCE-GROUP"
$acrName = "YOUR-AZURE-CONTAINER-REPO"
$frontendApp = "YOUR-FRONTEND-WEBAPP"
$backendApp = "YOUR-BACKEND-WEBAPP"

# 1. Get the Resource ID of the ACR
$acrId = az acr show --name $acrName --resource-group $rg --query id -o tsv

# --- Configure Frontend ---
Write-Host "Configuring Frontend: $frontendApp"
# Enable Identity
az webapp identity assign --name $frontendApp --resource-group $rg
# Get the Identity Principal ID
$fPrincipalId = az webapp show --name $frontendApp --resource-group $rg --query identity.principalId -o tsv
# Assign AcrPull Role
az role assignment create --assignee $fPrincipalId --role "AcrPull" --scope $acrId
# Set Web App to use Managed Identity for pulls
az webapp config set --name $frontendApp --resource-group $rg --generic-configurations '{"acrUseManagedIdentityCreds": true}'

# --- Configure Backend ---
Write-Host "Configuring Backend: $backendApp"
# Enable Identity
az webapp identity assign --name $backendApp --resource-group $rg
# Get the Identity Principal ID
$bPrincipalId = az webapp show --name $backendApp --resource-group $rg --query identity.principalId -o tsv
# Assign AcrPull Role
az role assignment create --assignee $bPrincipalId --role "AcrPull" --scope $acrId
# Set Web App to use Managed Identity for pulls
az webapp config set --name $backendApp --resource-group $rg --generic-configurations '{"acrUseManagedIdentityCreds": true}'

Write-Host "Configuration Complete. It may take 2-5 minutes for permissions to propagate."