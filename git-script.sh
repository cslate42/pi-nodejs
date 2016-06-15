
function gitUP() {
	echo \"-------------git add $(pwd)/.--------------------\"
	git add $(pwd)/.
	echo \"-------------git commit -m \"$@\"--------------------\"
	git commit -m "$@"
	echo \"-------------git push--------------------\"
	git push
}
