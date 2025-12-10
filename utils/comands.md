-- PARA USO LOCAL (CRIAR IMAGE ATRAVÉS DO DIR /pollex E COLOCÁ-LO MANUALMENTE COMO UMA IMAGEM DO DOCKER DESKTOP)

---- old ----
-- build docker image
docker compose -f docker/compose.yaml up
-- rebuild it
docker compose -f docker/compose.yaml up --build

---- new ----
-- build docker image
docker compose -f .\deployments\docker\tasks\compose.yaml --env-file .env up
docker compose -f .\.docker\tasks-compose.yaml --env-file .env up
-- rebuild it
docker compose -f .\deployments\docker\tasks\compose.yaml --env-file .env up --build

-- PARA CARREGAR A IMAGE DO DOCKER DESKTOP PARA O MINIKUBE
minikube start
minikube image load pollex-api
kubectl apply -f ./k8s/postgres-deployment.yaml
kubectl apply -f ./k8s/tasks-api-deployment.yaml
--Para Linux é necessário manter aberto
minikube service pollex-api --url

-- PARA IR BUSCAR A IMAGEM AO REPOSITÓRIO (DOCKER HUB) E CARREGÁ-LA NO MINIKUBE
minikube start
kubectl apply -f ./kubernetes/tasks-postgres.yaml

-- ATÉ ESTAR RUNNING
kubectl get pods

kubectl apply -f ./kubernetes/tasks.yaml

-- ATÉ ESTAR RUNNING
kubectl get pods

-- DEBUGGING
kubectl describe pods
--OR
kubectl logs "pod/service name"

--Para Linux é necessário manter aberto
minikube service kubernetes --url
-- SEE WHY kubernetes???

-- Deletes Deployments, Services, ConfigMaps, Secrets, Jobs, etc. / Deletes all PVCs in the default namespace
kubectl delete deployment,service,configmap,secret,job,cronjob,pod --all -n default
kubectl delete pvc --all -n default
