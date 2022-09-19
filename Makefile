bootstrap:
	docker-compose build
	docker-compose run --rm api python3 manage.py migrate
	docker-compose run --rm api python3 manage.py collectstatic --noinput
	docker-compose run --rm api python3 manage.py populatedb --createsuperuser
run:
	docker-compose up
run-backend:
	docker-compose up api worker
upgrade:
	git submodule update --remote
recipe:
    # generates clean zerops.yml with expanded anchors and hidden nodes and comments removed
	yq eval-all 'explode(.) | del(.".*") | ... comments=""' zerops.dist.yml > zerops.yml
